import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CommentService } from '../comment/comment.service';
import { CommentModule } from '../comment/comment.module';
import { PostModule } from '../post/post.module';
import { PostService } from 'src/post/post.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [CommentModule, PostModule, NotificationModule],
  providers: [ReplyService, CommentService, PostService, NotificationService],
  controllers: [ReplyController],
})
export class ReplyModule {}
