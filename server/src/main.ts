import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DtoValidationPipe } from './pipes/dto-validation.pipe';

const SERVER_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  /* 全局管道对gateways无效 */
  app.useGlobalPipes(new DtoValidationPipe());

  await app.listen(SERVER_PORT);

  console.log(`当前服务运行在：http://localhost:${SERVER_PORT} \r\n`);
}
bootstrap();
