import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CommentService } from '../comment/comment.service';
import { CommentModule } from '../comment/comment.module';
import { PostModule } from '../post/post.module';
import { PostService } from 'src/post/post.service';

@Module({
  imports: [CommentModule, PostModule],
  providers: [ReplyService, CommentService, PostService],
  controllers: [ReplyController],
})
export class ReplyModule {}
