import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolveFromRunRoot } from 'helpers/path';
import { EventsModule } from './routers/events/events.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolveFromRunRoot('./public'),
      exclude: ['/api*'],
    }),
    SocketModule,
    EventsModule,
  ],
})
export class AppModule {}
