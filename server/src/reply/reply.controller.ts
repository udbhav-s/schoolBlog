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
import { ApiTags, ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { ReplyService } from './reply.service';
import { CommentService } from '../comment/comment.service';
import { ReplyModel } from 'src/database/models/reply.model';
import { Levels } from 'src/common/util/level.enum';
import { ReplyCreateDto, ReplyUpdateDto } from './dto/replyCreate.dto';

@ApiTags('reply')
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/reply')
export class ReplyController {
  constructor(
    private replyService: ReplyService,
    private commentService: CommentService,
  ) {}

  @ApiOperation({ summary: 'Get replies by user' })
  @Get('user/:id')
  async getByUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ReplyModel[]> {
    return await this.replyService.getByUser(
      id,
      req.user.level < Levels.Moderator,
    );
  }
  
  @ApiOperation({ summary: 'Get reply by comment' })
  @Get('comment/:id')
  async getByComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ReplyModel[]> {
    // get the comment and post, check if comment exists
    const comment = await this.commentService.getById(id);
    if (!comment) throw new NotFoundException();
    // check if user can access post
    const post = await this.commentService.getPost(comment.id);
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // return reply
    return await this.replyService.getByComment(id);
  }

  @ApiOperation({ summary: 'Get reply by id' })
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ReplyModel> {
    // get reply, comment & post
    const reply = await this.replyService.getById(id);
    if (!reply) throw new NotFoundException();
    // get post and check if user can access
    const post = await this.commentService.getPost(reply.commentId);
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // return the reply
    return reply;
  }

  @ApiOperation({ summary: 'Create reply' })
  @Post('/create')
  async create(
    @Body(ValidationPipe) data: ReplyCreateDto,
    @Request() req,
  ): Promise<ReplyModel> {
    // check if comment exists
    const comment = await this.commentService.getById(data.commentId);
    if (!comment) throw new NotFoundException();
    // check if user can comment on post
    const post = await this.commentService.getPost(data.commentId);
    if (!post.canAccess(req.user)) throw new ForbiddenException();
    // create the comment
    data.userId = req.user.id;
    return await this.replyService.create(data);
  }

  @ApiOperation({ summary: 'Update reply' })
  @Post('/update/:id')
  async update(
    @Body(ValidationPipe) data: ReplyCreateDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ReplyModel> {
    // check if reply exists and is by user
    const reply = await this.replyService.getById(id);
    if (!reply) throw new NotFoundException();
    if (reply.userId !== req.user.id) throw new ForbiddenException();
    // update reply (only body is changed)
    let updateData = {
      ...data,
      id,
      edited: true,
      userId: req.user.id,
      commentId: reply.commentId,
    } as ReplyUpdateDto;
    return await this.replyService.update(updateData);
  }

  @ApiOperation({ summary: 'Delete reply' })
  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ReplyModel> {
    // check if reply exists and is by user
    const reply = await this.commentService.getById(id);
    if (!reply) throw new NotFoundException();
    if (!reply.canDelete(req.user)) throw new ForbiddenException();
    // delete reply
    return await this.replyService.del(id);
  }
}
