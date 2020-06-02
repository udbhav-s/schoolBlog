import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { json } from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set up passport
  app.use(
    session({
      secret: 'ok',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // request size limit
  app.use(json({ limit: '80MB' }));

  // set up swagger for API documentation
  const options = new DocumentBuilder()
    .setTitle('School Blog')
    .setDescription('API Documentation for the School Blog server')
    .setVersion('1.0')
    .addTag('user')
    .addTag('post')
    .addTag('comment')
    .addTag('reply')
    .addTag('file')
    .addTag('category')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
