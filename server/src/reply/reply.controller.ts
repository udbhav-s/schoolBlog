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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { ReplyService } from './reply.service';
import { CommentService } from '../comment/comment.service';
import { ReplyModel } from 'src/database/models/reply.model';
import { Levels } from 'src/common/util/level.enum';
import { ReplyCreateDto } from './dto/replyCreate.dto';
import { LevelGuard } from 'src/common/guards/level.guard';
import { Level } from 'src/common/decorators/level.decorator';
import { ReplyGetOptionsDto } from './dto/replyGetOptions.dto';
import { PostService } from 'src/post/post.service';
import { PermissionLevels } from 'src/common/util/permissionLevels.enum';
import { NotificationService } from 'src/notification/notification.service';

@ApiTags('reply')
@ApiBasicAuth()
@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/reply')
export class ReplyController {
  constructor(
    private replyService: ReplyService,
    private commentService: CommentService,
    private postService: PostService,
    private notificationService: NotificationService
  ) {}

  @ApiOperation({ summary: 'Get all replies' })
  @Get('/all')
  async getAll(
    @Query(new ValidationPipe({ transform: true })) options: ReplyGetOptionsDto,
    @Request() req
  ): Promise<ReplyModel[]> {
    if (options.commentId) {
      // get the comment and post, check if comment exists
      const comment = await this.commentService.getById(options.commentId);
      if (!comment) throw new NotFoundException();
      // check if user can access post
      const post = await this.postService.getById(comment.postId, req.user, PermissionLevels.Access);
      if (!post) throw new NotFoundException();
    }
    else if (req.user.level < Levels.Moderator) throw new ForbiddenException();
    return await this.replyService.getAll(options);
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
    const comment = await this.commentService.getById(reply.commentId);
    const post = await this.postService.getById(comment.postId, req.user, PermissionLevels.Access);
    // check if user can acccess
    if (!post) throw new NotFoundException();
    // return the reply
    return reply;
  }

  @ApiOperation({ summary: 'Create reply' })
  @UseGuards(LevelGuard)
  @Level(Levels.Member)
  @Post('/create')
  async create(
    @Body(ValidationPipe) data: ReplyCreateDto,
    @Request() req,
  ): Promise<ReplyModel> {
    // check if comment exists
    const comment = await this.commentService.getById(data.commentId);
    if (!comment) throw new NotFoundException();
    // check if user can comment on post
    const post = await this.postService.getById(comment.postId, req.user, PermissionLevels.Access);
    if (!post) throw new NotFoundException();

    // create the comment
    data.userId = req.user.id;
    const reply = await this.replyService.create(data);

    if (comment.userId !== req.user.id) {
      // send notification to comment author
      this.notificationService.send({
        recipientId: comment.userId,
        senderId: req.user.id,
        action: 'reply',
        objectId: post.id
      });
    }

    return reply;
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
    const updateData = {
      ...data,
      edited: true,
      userId: req.user.id,
      commentId: reply.commentId,
    };
    return await this.replyService.update(id, updateData);
  }

  @ApiOperation({ summary: 'Delete reply' })
  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ReplyModel> {
    // check if reply exists and is by user
    const reply = await this.replyService.getById(id);
    if (!reply) throw new NotFoundException();
    if (reply.userId !== req.user.id && req.user.level < Levels.Moderator)
      throw new ForbiddenException();
    // delete reply
    return await this.replyService.del(id);
  }
}
