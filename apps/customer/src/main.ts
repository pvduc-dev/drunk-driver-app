import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('short'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer API')
    .setDescription('Customer API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument, {
    jsonDocumentUrl: 'api-docs-json',
  });

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('CUSTOMER_APP_PORT', 7000);
  await app.listen(port);
}
void bootstrap();
