import {
  Controller,
  UseGuards,
  Get,
  Param,
  Request,
  Response,
  NotFoundException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  Post,
  Body,
  ValidationPipe,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FileService } from './file.service';
import { PostService } from 'src/post/post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/fileUpload.dto';
import * as aws from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { FileModel } from 'src/database/models/file.model';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const bucketName = process.env.S3_BUCKET_NAME;

@ApiTags('file')
@UseGuards(AuthenticatedGuard)
@Controller('api/file')
export class FileController {
  constructor(
    private fileService: FileService,
    private postService: PostService,
  ) {}

  @Get(':filename')
  async getImageByName(
    @Param('filename') filename: string,
    @Request() req,
    @Response() res,
  ) {
    // check if file exists
    const file = await this.fileService.getByFilename(filename);
    if (!file) throw new NotFoundException();
    // check if user can access
    if (!file.post.canAccess(req.user)) throw new ForbiddenException();

    // redirect to a pre signed url to access the file
    const url = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: filename,
      Expires: 180 // url expires in 3 minutes
    });
    res.redirect(url);
  }

  @UseInterceptors(
    FormatResponseInterceptor,
    FileInterceptor('file', {
      storage: multerS3({
        s3: s3,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          const basename = path.basename(file.originalname, ext);
          cb(null, basename + "_" + Date.now().toString() + ext);
        }
      })
    })
  )
  @Post('/upload')
  async uploadFile(
    @UploadedFile() file, 
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true
    })) body: FileUploadDto,
    @Request() req,
  ): Promise<string> {
    try {
      // get post
      const post = await this.postService.getById(body.postId);
      if (!post) throw new NotFoundException();
      if (!post.canAccess(req.user)) throw new ForbiddenException();

      console.log(file);

      // validate if image
      if (body.type === "image" || body.type === "thumbnail") {
        if (!file.contentType.match(/image\/(jpg|jpeg|png|gif)$/)) {
          throw new BadRequestException("File isn't a valid image");
        }
      }
      // if thumbnail remove old thumbnail
      if (body.type === "thumbnail") {
        const thumbnail = (await this.fileService.getByPost(body.postId, true))[0];
        if (thumbnail) {
          // delete from s3
          await s3.deleteObject({ Bucket: bucketName, Key: thumbnail.filename }).promise();
          // remove from database
          await this.fileService.removeFilename(thumbnail.filename);
        }
      }
      // store filename in database
      await this.fileService.storeFilename({
        postId: body.postId,
        filename: file.key,
        type: body.type
      });

      // return key
      return file.key;
    }
    catch (err) {
      // delete file
      await s3.deleteObject({ Bucket: bucketName, Key: file.key }).promise();
      throw err;
    }
  }

  @Delete(":filename")
  async removeFile(
    @Param('filename') filename: string,
    @Request() req,
  ): Promise<FileModel> {
    // check if file exists
    const file = await this.fileService.getByFilename(filename);
    if (!file) throw new NotFoundException();
    // check if user can modify
    if (!file.post.canDelete(req.user)) throw new ForbiddenException();
    // delete file from s3
    await s3.deleteObject({ Bucket: bucketName, Key: filename }).promise();
    // delete from database
    return await this.fileService.removeFilename(filename);
  }
}
