import {
  Controller,
  UseGuards,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Request,
  Get,
  Post,
  ForbiddenException,
  Body,
  ValidationPipe,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { CommentService } from './comment.service';
import { CommentModel } from 'src/database/models/comment.model';
import { Levels } from 'src/common/util/level.enum';
import { PostService } from 'src/post/post.service';
import { CommentCreateDto, CommentUpdateDto } from './dto/commentCreate.dto';

@ApiTags('comment')
@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private postService: PostService,
  ) {}

  @Get('user/:id')
  async getByUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CommentModel[]> {
    return await this.commentService.getByUser(
      id,
      req.user.level < Levels.Moderator,
    );
  }

  @Get('post/:id')
  async getByPost(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CommentModel[]> {
    // get the post
    const post = await this.postService.getById(id);
    if (!post) throw new NotFoundException();
    // check if user can access
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // return comment
    return await this.commentService.getByPost(id);
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CommentModel> {
    // get comment and post
    const comment = await this.commentService.getById(id);
    if (!comment) throw new NotFoundException();
    const post = await this.postService.getById(comment.postId);
    // check if user can access post
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // return the comment
    return comment;
  }

  @Post('/create')
  async create(
    @Body(ValidationPipe) data: CommentCreateDto,
    @Request() req,
  ): Promise<CommentModel> {
    const post = await this.postService.getById(data.postId);
    if (!post) throw new NotFoundException();
    // check if user can comment on post
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // create the comment
    data.userId = req.user.id;
    return await this.commentService.create(data);
  }

  @Post('/update/:id')
  async update(
    @Body(ValidationPipe) data: CommentCreateDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CommentModel> {
    // check if comment exists and is by user
    const comment = await this.commentService.getById(id);
    if (!comment) throw new NotFoundException();
    if (comment.userId !== req.user.id) throw new ForbiddenException();
    // update comment (only body is changed)
    let updateData = {
      ...data,
      edited: true,
      userId: req.user.id,
      postId: comment.postId,
    } as CommentUpdateDto;
    return await this.commentService.update(updateData);
  }

  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<CommentModel> {
    // check if comment exists and is by user
    const comment = await this.commentService.getById(id);
    if (!comment) throw new NotFoundException();
    if (!comment.canDelete(req.user)) throw new ForbiddenException();
    // delete comment
    return await this.commentService.del(id);
  }
}