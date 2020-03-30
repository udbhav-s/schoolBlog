import { Controller, UseGuards, Get, Param, Request, Response, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';
import { PostService } from 'src/post/post.service';

@ApiTags('file')
@UseGuards(AuthenticatedGuard)
@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    private configService: ConfigService,
    private postService: PostService
  ) {}

  @Get('image/:filename')
  async getImageByName(
    @Param('filename') filename: string,
    @Request() req,
    @Response() res
  ) {
    // check if file exists
    let file = await this.fileService.getByFilename(filename);
    if (!file) throw new NotFoundException();
    // check if user can access 
    if (!file.post.canAccess(req.user)) throw new ForbiddenException();
    // send the file 
    let imagesPath = this.configService.get<string>('IMAGES_PATH');
    res.sendFile(path.join(imagesPath, filename));
  }

  @Get('thumbnail/:filename')
  async getThumbnailByName(
    @Param('filename') filename: string,
    @Request() req,
    @Response() res
  ) {
    // get post 
    let post = await this.postService.getByThumbnail(filename);
    if (!post) throw new NotFoundException();
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // send the image
    let thumbnailsPath = this.configService.get<string>('THUMBNAILS_PATH');
    res.sendFile(path.join(thumbnailsPath, filename));
  }
}
