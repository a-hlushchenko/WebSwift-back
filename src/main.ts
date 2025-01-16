import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['https://web-swift.co', 'https://ua.web-swift.co'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['x-new-access-token'],
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors = []) => {
        const errors = validationErrors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new BadRequestException(errors.join('; '));
      },
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
