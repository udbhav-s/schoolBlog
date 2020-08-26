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
  NotFoundException,
  UseInterceptors,
  Query,
  Delete,
  BadRequestException,
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
import { PermissionLevels } from 'src/common/util/permissionLevels.enum';

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
    // default order newest first
    if (!options.orderBy) {
      options.orderBy = 'createdAt';
      options.order = 'desc';
    }
    // return result
    return await this.postService.getAll(options, req.user);
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

  @ApiOperation({ summary: 'Update a post' })
  @Post('/update/:id')
  async update(
    @Body(new ValidationPipe({ transform: true })) data: PostCreateDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<PostModel> {
    // get post to be updated
    const post = await this.postService.getById(id, req.user, PermissionLevels.Edit);
    if (!post) throw new NotFoundException();

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
    const post = await this.postService.getById(id, req.user, PermissionLevels.Edit);
    if (!post) throw new NotFoundException();

    return await this.postService.publish(id);
  }

  @ApiOperation({ summary: "Change post category" })
  @UseGuards(LevelGuard)
  @Level(Levels.Moderator)
  @Post('/category/:id')
  async setCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { categoryId: number },
  ): Promise<PostModel> {
    // get post to be published
    const post = await this.postService.getById(id);
    if (!post) throw new NotFoundException();

    return await this.postService.update(id, data);
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

  @ApiOperation({ summary: 'Like a post' })
  @UsePipes(ParseIntPipe)
  @UseGuards(LevelGuard)
  @Level(Levels.Reader)
  @Post('/like/:id')
  async like(@Param('id') id: number, @Request() req) {
    const post = await this.postService.getById(id, req.user, PermissionLevels.Access);
    // check if user can access
    if (!post) throw new NotFoundException();
    if (post.isLiked) throw new BadRequestException();
    // return the post
    return await this.postService.like(id, req.user.id);
  }

  @ApiOperation({ summary: 'Unlike a post' })
  @UsePipes(ParseIntPipe)
  @UseGuards(LevelGuard)
  @Level(Levels.Reader)
  @Post('/unlike/:id')
  async unlike(@Param('id') id: number, @Request() req) {
    const post = await this.postService.getById(id, req.user, PermissionLevels.Access);
    // check if user can access
    if (!post) throw new NotFoundException();
    if (!post.isLiked) throw new BadRequestException();
    // return the post
    return await this.postService.unlike(id, req.user.id);
  }

  @ApiOperation({ summary: 'Get a post by id' })
  @UsePipes(ParseIntPipe)
  @Get('/:id')
  async getById(@Param('id') id: number, @Request() req): Promise<PostModel> {
    const post = await this.postService.getById(id, req.user, PermissionLevels.Access);
    // check if user can access
    if (!post) throw new NotFoundException();
    // return the post
    return post;
  }

  @ApiOperation({ summary: 'Delete a post' })
  @UsePipes(ParseIntPipe)
  @Delete('/:id')
  async del(@Param('id') id: number, @Request() req): Promise<PostModel> {
    const post = await this.postService.getById(id, req.user, PermissionLevels.Delete);
    // check if user can access
    if (!post) throw new NotFoundException();
    // remove thumbnail and images
    this.fileService.removePostFiles(post.id);
    // delete and return the post
    return await this.postService.del(post.id);
  }
}
