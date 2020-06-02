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
import * as multer from "multer";
import * as fs from 'fs';
import { FileModel } from 'src/database/models/file.model';

@ApiTags('file')
@UseGuards(AuthenticatedGuard)
@Controller('api/file')
export class FileController {
  constructor(
    private fileService: FileService,
    private postService: PostService,
  ) {}

  @Get("thumbnail/:postId")
  async getPostThumbnail(
    @Param('postId') postId: number,
    @Request() req,
    @Response() res
  ) {
    // check if thumbnail exists
    const file = await this.fileService.getByPost(postId, true)[0];
    if (!file) throw new NotFoundException();
    // check if user can access
    if (!file.post.canAccess(req.user)) throw new ForbiddenException();
    // send the file
    const uploadsPath = process.env.UPLOADS_PATH;
    res.sendFile(path.join(uploadsPath, file.filename));
  }

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
    // send the file
    const uploadsPath = process.env.UPLOADS_PATH;
    res.sendFile(path.join(uploadsPath, filename));
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: process.env.UPLOADS_PATH,
        filename: (_req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname))
        }
      })
    })
  )
  @Post('/upload/:id')
  async uploadFile(
    @UploadedFile() file, 
    @Body(ValidationPipe) body: FileUploadDto,
    @Param('id') id: number,
    @Request() req,
  ): Promise<FileModel> {
    try {
      // get post
      const post = await this.postService.getById(id);
      if (!post) throw new NotFoundException();
      if (!post.canAccess(req.user)) throw new ForbiddenException();
      // validate if image
      if (body.type === "image" || body.type === "thumbnail") {
        if (!file.filename.match(/\.(jpg|jpeg|png|gif)$/)) {
          throw new BadRequestException("File isn't a valid image");
        }
      }
      // if thumbnail remove old thumbnail
      if (body.type === "thumbnail") {
        const thumbnail = (await this.fileService.getByPost(id, true))[0];
        if (thumbnail) {
          fs.unlinkSync(path.join(process.env.UPLOADS_PATH, thumbnail.filename));
          await this.fileService.removeFilename(thumbnail.filename);
        }
      }
      // store filename in database
      return await this.fileService.storeFilename({
        postId: id,
        filename: file.filename,
        type: body.type
      });
    }
    catch (err) {
      // delete file
      fs.unlinkSync(path.join(file.destination, file.filename));
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
    // check if user can access
    if (!file.post.canAccess(req.user)) throw new ForbiddenException();
    // delete file
    fs.unlinkSync(path.join(process.env.UPLOADS_PATH, filename));
    // delete from database
    return await this.fileService.removeFilename(filename);
  }
}
