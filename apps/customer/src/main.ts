import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/customer');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer API')
    .setDescription('Customer API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('customer/api-docs', app, swaggerDocument, {
    jsonDocumentUrl: '/customer/api-docs-json',
  });

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('CUSTOMER_APP_PORT', 3000);
  await app.listen(port);
}
void bootstrap();
