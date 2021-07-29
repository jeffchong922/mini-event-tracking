import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MiniEventService } from './mini-event.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly miniEventService: MiniEventService) {}

  handleConnection(client: Socket) {
    /* 现在全走miniEventService */
    this.miniEventService.addClient(client);
  }
}
