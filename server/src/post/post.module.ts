import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [FileModule],
  controllers: [PostController],
  providers: [PostService, FileService],
})
export class PostModule {}
