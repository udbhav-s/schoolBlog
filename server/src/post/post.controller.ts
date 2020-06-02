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
import { PostGetOptionsDto } from './dto/postGetOptions.dto';
import { PostCreateDto } from './dto/postCreate.dto';

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
    @Query(new ValidationPipe({ transform: true })) options: PostGetOptionsDto,
    @Request() req,
  ): Promise<PostModel[]> {
    // set restrictions for < mod
    if (req.user.level < Levels.Moderator) {
      // if user wants to get posts by a specific user
      // get only verified posts by that user
      if (options.userId) {
        options.verified = true;
      }
      // if user wants all posts
      // get posts which are either verified or by the user themself
      else {
        options.verifiedOrUser = true;
        options.userId = req.user.id;
      }
    }
    // if user wants unpublished posts show only theirs
    if (options.published === false) {
      options.userId = req.user.id;
    } else options.published = true;
    // default order newest first
    if (!options.orderBy) {
      options.orderBy = 'createdAt';
      options.order = 'desc';
    }
    // return result
    return await this.postService.getAll(options);
  }

  @ApiOperation({ summary: 'Create a blank post draft' })
  @UseGuards(LevelGuard)
  @Level(Levels.Member)
  @UsePipes(ValidationPipe)
  @Post('/create')
  async create(
    @Request() req,
  ): Promise<PostModel> {
    const post = {
      title: "Untitled Draft",
      userId: req.user.id,
      verified: req.user.level >= Levels.Author,
    } as PostCreateDto;

    return await this.postService.create(post);
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

    // sanitize
    data.body = this.postService.sanitizeBody(data.body);

    // set user id
    data = {
      ...data,
      userId: req.user.id,
    };

    // update post
    return await this.postService.update(id, data);
  }

  @ApiOperation({ summary: 'Publish a draft' })
  @UseGuards(LevelGuard)
  @Level(Levels.Member)
  @UsePipes(ValidationPipe)
  @Post('/publish/:id')
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<PostModel> {
    // get post to be published
    const post = await this.postService.getById(id);
    if (!post) throw new NotFoundException();

    // check if post is by user
    if (post.userId !== req.user.id) {
      throw new ForbiddenException();
    }

    return await this.postService.publish(id);
  }

  @ApiOperation({ summary: 'Unpublish a post' })
  @UseGuards(LevelGuard)
  @Level(Levels.Member)
  @UsePipes(ValidationPipe)
  @Post('/unpublish/:id')
  async unpublish(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<PostModel> {
    // get post to be published
    const post = await this.postService.getById(id);
    if (!post) throw new NotFoundException();

    // check if post is by user
    if (post.userId !== req.user.id) {
      throw new ForbiddenException();
    }

    return await this.postService.unpublish(id);
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

  @ApiOperation({ summary: 'Delete a post' })
  @UsePipes(ParseIntPipe)
  @Delete('/:id')
  async del(@Param('id') id: number, @Request() req): Promise<PostModel> {
    const post = await this.postService.getById(id);
    // check if user can access
    if (!post.canDelete(req.user)) throw new ForbiddenException();
    // remove thumbnail and images
    this.fileService.removePostFiles(post.id);
    // delete and return the post
    return await this.postService.del(post.id);
  }
}
