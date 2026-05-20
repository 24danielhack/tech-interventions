import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Tech Intervention Management API')
    .setDescription(
      'SaaS API for IT Technicians - Intervention Management, Inventory, Reports & Exports',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('http://localhost:3001', 'Development')
    .addServer('https://api.example.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port, () => {
    console.log(`✅ Tech Intervention API running on port ${port}`);
    console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
  });
}

bootstrap();
