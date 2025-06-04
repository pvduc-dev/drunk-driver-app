import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/driver');
  app.use(morgan('common'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Driver API')
    .setDescription('Driver API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('driver/api-docs', app, swaggerDocument, {
    jsonDocumentUrl: 'driver/api-docs-json',
  });

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('DRIVER_APP_PORT', 3001);
  await app.listen(port);
}
void bootstrap();
