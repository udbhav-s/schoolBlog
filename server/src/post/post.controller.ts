import {
  Controller,
  UseGuards,
  Get,
  UsePipes,
  ValidationPipe,
  Body,
  Request,
  Param,
  ParseIntPipe,
  Post,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto, PostUpdateDto } from './dto/postCreate.dto';
import { PostModel } from '../database/models/post.model';
import { Level } from '../common/decorators/level.decorator';
import { LevelGuard } from '../common/guards/level.guard';
import { Levels } from '../common/util/level.enum';
import { FileService } from '../file/file.service';

@ApiTags('post')
@UseGuards(AuthenticatedGuard)
@Controller('api/post')
export class PostController {
  constructor(
    private postService: PostService,
    private fileService: FileService,
  ) {}

  @UsePipes(ValidationPipe)
  @Post('/all')
  async getAll(
    @Body() opts: PostGetOptionsDto,
    @Request() req,
  ): Promise<PostModel[]> {
    const options = {
      userId: req.user.id,
      verifiedOrCurrentUser: req.user.level < Levels.Moderator,
      ...opts,
    } as PostGetOptionsDto;
    return await this.postService.getAll(options);
  }

  @UsePipes(ParseIntPipe)
  @Get('/user/:id')
  async getByUser(@Param('id') id: number): Promise<PostModel[]> {
    return await this.postService.getByUser(id);
  }

  @UsePipes(ParseIntPipe)
  @Get('/:id')
  async getById(@Param('id') id: number): Promise<PostModel> {
    return await this.postService.getById(id);
  }

  @UsePipes(ValidationPipe)
  @Post('/create')
  async create(
    @Body() data: PostCreateDto,
    @Request() req,
  ): Promise<PostModel> {
    const post = {
      userId: req.user.id,
      verified: req.user.level >= Levels.Author,
      ...data,
    } as PostCreateDto;

    // sanitize the post html
    post.body = this.postService.sanitizeBody(post.body);
    // upload thumbnail if present
    if (post.thumbnail) {
      post.thumbnail = this.fileService.uploadThumbnail(post.thumbnail);
    }
    // separate images from post
    const { html, filenames } = this.fileService.separateAndStoreImages(
      post.body,
    );
    post.body = html;

    // turn filenames into object to store using query
    const files: any[] = filenames.map(filename => ({ filename }));
    // add files to post body to insert as graph
    if (files.length > 0) post.files = files;

    // create the post
    return await this.postService.create(post);
  }

  // Returns post with images & thumbnail paths replaced by base64
  // Since update request deletes all old images and uploads new ones
  @Get('/edit/:id')
  async getEditMode(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    // get the post
    const post = await this.postService.getById(id);
    if (!post) throw new NotFoundException();

    // get post files
    const files = await this.fileService.getByPost(post.id);
    const filenames = files.map(({ filename }) => filename);

    // change the image urls to base64
    if (post.body) {
      post.body = this.fileService.joinImages(filenames, post.body);
    }

    // change the thumbnail to base64
    if (post.thumbnail) {
      post.thumbnail = await this.fileService.getBase64Thumbnail(
        post.thumbnail,
      );
    }

    // return the post
    return post;
  }

  // the update method in the post service uses upsertGraph
  // any properties which are not specified in the update request will be DELETED
  @Post('/update/:id')
  async update(
    @Body(ValidationPipe) data: PostUpdateDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<PostModel> {
    // get post to be updated
    const post = await this.postService.getById(id);
    if (!post) throw new BadRequestException();

    // check if post is by user
    if (post.userId !== req.user.id) {
      throw new ForbiddenException();
    }

    // delete the old thumbnail (even if new thumbnail is not present in request data)
    if (post.thumbnail) this.fileService.removeThumbnail(post.thumbnail);
    // upload new thumbnail if present
    if (data.thumbnail)
      data.thumbnail = this.fileService.uploadThumbnail(data.thumbnail);
    else data.thumbnail = '';

    // new body
    let files: any[] = [];
    // if old post had images delete them
    if (post.body) this.fileService.removePostFiles(post.id);
    // process the new body
    if (data.body) {
      // sanitize
      data.body = this.postService.sanitizeBody(data.body);
      // separate and store new images
      const { html, filenames } = this.fileService.separateAndStoreImages(
        data.body,
      );
      data.body = html;
      // add filenames to files for graph insert
      files = filenames.map(filename => ({ filename }));
    }
    // add the new files
    if (files.length > 0) data.files = files;

    // set the userId to the current user
    data.userId = req.user.id;
    // set the post id to be updated (since service uses upsertGraph)
    data.id = post.id;

    // update post
    return await this.postService.update(data);
  }

  @UsePipes(ParseIntPipe)
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Post('/verify/:id')
  async verify(@Param('id') id: number): Promise<PostModel> {
    return await this.postService.verify(id);
  }

  @UsePipes(ParseIntPipe)
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Post('/unverify/:id')
  async unverify(@Param('id') id: number): Promise<PostModel> {
    return await this.postService.unverify(id);
  }
}
