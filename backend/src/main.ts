import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Disable default body parser
  });
  
  // Enable CORS
  app.enableCors({
    origin: "*",
    credentials: true,
  });

  // Configure body parser with increased limits
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  // Serve static files from uploads directory
  app.use('/uploads', require('express').static('uploads'));

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Backend server running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
