import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PostModule } from '../post/post.module';
import { PostService } from '../post/post.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [PostModule, NotificationModule],
  providers: [CommentService, PostService, NotificationService],
  controllers: [CommentController],
})
export class CommentModule {}
