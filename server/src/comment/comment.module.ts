import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PostModule } from '../post/post.module';
import { PostService } from '../post/post.service';

@Module({
  imports: [PostModule],
  providers: [CommentService, PostService],
  controllers: [CommentController],
})
export class CommentModule {}
