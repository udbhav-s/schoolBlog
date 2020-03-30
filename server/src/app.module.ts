import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FileModule } from './file/file.module';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    PostModule,
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommentModule,
    ReplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
