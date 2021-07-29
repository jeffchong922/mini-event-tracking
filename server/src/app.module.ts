import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolveFromRunRoot } from 'helpers/path';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolveFromRunRoot('./public'),
      exclude: ['/api*'],
    }),
    SocketModule,
  ],
})
export class AppModule {}
