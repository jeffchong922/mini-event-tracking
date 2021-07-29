import { Module } from '@nestjs/common';
import { MiniEventService } from './mini-event.service';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketGateway, MiniEventService],
})
export class SocketModule {}
