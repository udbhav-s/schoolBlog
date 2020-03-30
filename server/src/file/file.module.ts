import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { PostModule } from '../post/post.module';
import { PostService } from '../post/post.service';

@Module({
  imports: [PostModule],
  providers: [FileService, PostService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
