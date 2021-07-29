import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DtoValidationPipe } from './pipes/dto-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  /* 全局管道对gateways无效 */
  app.useGlobalPipes(new DtoValidationPipe());

  await app.listen(3000);
}
bootstrap();
