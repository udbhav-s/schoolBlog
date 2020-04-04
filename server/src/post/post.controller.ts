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
  ForbiddenException,
  NotFoundException,
  UseInterceptors,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { PostService } from './post.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { PostModel } from '../database/models/post.model';
import { Level } from '../common/decorators/level.decorator';
import { LevelGuard } from '../common/guards/level.guard';
import { Levels } from '../common/util/level.enum';
import { FormatResponseInterceptor } from '../common/interceptors/formatResponse.interceptor';
import { FileService } from '../file/file.service';
import { GetOptionsDto } from '../common/dto/getOptions.dto';
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto, PostUpdateDto } from './dto/postCreate.dto';

@ApiTags('post')
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/post')
export class PostController {
  constructor(
    private postService: PostService,
    private fileService: FileService,
  ) {}

  @ApiOperation({ summary: 'Get all posts with pagination options' })
  @Get('/all')
  async getAll(
    @Query(new ValidationPipe({ transform: true })) options: GetOptionsDto,
    @Request() req,
  ): Promise<PostModel[]> {
    // set options
    options = {
      ...options,
      userId: req.user.id,
      verifiedOrCurrentUser: req.user.level < Levels.Moderator,
    } as PostGetOptionsDto;
    // return result
    return await this.postService.getAll(options);
  }

  @ApiOperation({ summary: 'Get all posts by user (will only get verified for < moderator)' })
  @Get('/user/:id')
  async getByUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) options: GetOptionsDto,
  ): Promise<PostModel[]> {
    // set options
    options = {
      ...options,
      verifiedOrCurrentUser: req.user.level < Levels.Moderator,
      userId: req.user.id,
    } as PostGetOptionsDto;
    // return result
    return await this.postService.getByUser(id, options);
  }

  @ApiOperation({ summary: 'Create a post' })
  @UseGuards(LevelGuard)
  @Level(Levels.Member)
  @UsePipes(ValidationPipe)
  @Post('/create')
  async create(
    @Body() data: PostCreateDto,
    @Request() req,
  ): Promise<PostModel> {
    const post = {
      ...data,
      userId: req.user.id,
      verified: req.user.level >= Levels.Author,
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
  @ApiOperation({ summary: 'Get a post with base64 embedded images instead of file URLs for editing' })
  @Get('/edit/:id')
  async getEditMode(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<PostModel> {
    // get the post
    const post = await this.postService.getById(id);
    if (!post) throw new NotFoundException();

    // check if user can access post
    if (!post.canAccess(req.user)) throw new ForbiddenException();

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
  @ApiOperation({ summary: 'Update a post' })
  @Post('/update/:id')
  async update(
    @Body(ValidationPipe) data: PostCreateDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<PostModel> {
    // get post to be updated
    const post = await this.postService.getById(id);
    if (!post) throw new NotFoundException();

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

    // set post id and user id 
    data = {
      ...data,
      id: post.id,
      userId: req.user.id
    } as PostUpdateDto;

    // update post
    return await this.postService.update(data);
  }

  @ApiOperation({ summary: 'Verify a post' })
  @UsePipes(ParseIntPipe)
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Post('/verify/:id')
  async verify(@Param('id') id: number): Promise<PostModel> {
    const post = await this.postService.verify(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @ApiOperation({ summary: 'Unverify a post' })
  @UsePipes(ParseIntPipe)
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Post('/unverify/:id')
  async unverify(@Param('id') id: number): Promise<PostModel> {
    const post = await this.postService.unverify(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @ApiOperation({ summary: 'Get a post by id' })
  @UsePipes(ParseIntPipe)
  @Get('/:id')
  async getById(@Param('id') id: number, @Request() req): Promise<PostModel> {
    const post = await this.postService.getById(id);
    // check if user can access
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // return the post
    return post;
  }

  @ApiOperation({ summary: 'Delete a post'})
  @UsePipes(ParseIntPipe)
  @Delete('/:id')
  async del(@Param('id') id: number, @Request() req): Promise<PostModel> {
    const post = await this.postService.getById(id);
    // check if user can access
    if (!post.canDelete(req.user)) throw new ForbiddenException();
    // remove thumbnail and images
    if (post.thumbnail) this.fileService.removeThumbnail(post.thumbnail);
    this.fileService.removePostFiles(post.id);
    // delete and return the post
    return await this.postService.del(post.id);
  }
}
