import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CommentService } from '../comment/comment.service';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [CommentModule],
  providers: [ReplyService, CommentService],
  controllers: [ReplyController],
})
export class ReplyModule {}
