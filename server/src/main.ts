import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set up passport 
  app.use(session({
    secret: 'ok',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // set up swagger for API documentation
  const options = new DocumentBuilder()
    .setTitle('School Blog')
    .setDescription('API Documentation for the School Blog server')
    .setVersion('1.0')
    .addTag("user")
    .addTag("post")
    .addTag("comment")
    .addTag("reply")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(3000);
}

bootstrap();
