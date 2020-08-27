import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { MulterModule } from '@nestjs/platform-express';

import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    PostModule,
    CommentModule,
    ReplyModule,
    FileModule,
    CategoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    MulterModule.register({
      dest: process.env.IMAGES_PATH
    }),
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
