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
import * as multer from 'multer';
import * as shortid from 'shortid';
import { FileModel } from 'src/database/models/file.model';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { s3, bucketName } from './s3';
import { PermissionLevels } from 'src/common/util/permissionLevels.enum';

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
    if (!(await this.postService.getById(file.postId, req.user, PermissionLevels.Access)))
      throw new ForbiddenException();

    if (process.env.STORAGE === 's3') {
      // redirect to a pre signed url to access the file
      const url = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: filename,
        Expires: 60 // url expires in 1 minute
      });
      res.redirect(url);
    } else if (process.env.STORAGE === 'local') {
      res.sendFile(path.join(process.env.UPLOADS_PATH, filename));
    }
  }

  @UseInterceptors(
    FormatResponseInterceptor,
    FileInterceptor('file', {
      storage: multer.memoryStorage()
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
    // get post
    const post = await this.postService.getById(body.postId, req.user, PermissionLevels.Edit);
    if (!post) throw new NotFoundException();

    // validate if image
    if (body.type === "image" || body.type === "thumbnail") {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
        throw new BadRequestException("File isn't a valid image");
      }

      // convert to jpeg
      file.buffer = await this.fileService.imageToJpeg(file.buffer);
    }

    // set file name
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    let filename = basename + "_" + shortid.generate();
    // add extension
    filename += (body.type === "image" || body.type === "thumbnail") ? '.jpeg' : ext;

    // if thumbnail remove old thumbnail
    if (body.type === "thumbnail") {
      const thumbnail = (await this.fileService.getByPost(body.postId, true))[0];
      if (thumbnail) {
        // delete file
        await this.fileService.deleteFile(thumbnail.filename);
        // remove from database
        await this.fileService.removeFilenameDB(thumbnail.filename);
      }
    }

    // store file
    await this.fileService.storeFile(filename, file.buffer)

    // store filename in database
    await this.fileService.storeFilenameDB({
      postId: body.postId,
      filename: filename,
      type: body.type
    });

    // return key
    return filename;
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
    if (!(await this.postService.getById(file.postId, req.user, PermissionLevels.Edit)))
      throw new ForbiddenException();
    // delete file from s3
    await this.fileService.deleteFile(filename);
    // delete from database
    return await this.fileService.removeFilenameDB(filename);
  }
}
