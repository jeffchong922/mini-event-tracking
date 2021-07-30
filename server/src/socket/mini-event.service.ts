import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { EmitterEvents } from 'src/enums/emitter/emitter-events.enum';
import { SocketEvents } from 'src/enums/socket/socket-events.enum';
import { MiniEventEvent } from 'src/events/mini-event.event';
import { MiniEvent } from 'src/interfaces/socket/mini-event.interface';

@Injectable()
export class MiniEventService {
  private readonly clientList: Socket[] = [];

  addClient(client: Socket) {
    this.clientList.push(client);
    setTimeout(() => {
      this.emitEvent(
        {
          id: 'nestjs',
          behavior: '连接成功',
          comments: '这条消息并非来自小程序（由后端生成）',
        },
        client,
      );
    }, 1000);
  }

  removeClient(client: Socket) {
    const targetIdx = this.clientList.findIndex(
      (item) => item.id === client.id,
    );
    if (targetIdx !== -1) {
      this.clientList.splice(targetIdx, 1);
    }
  }

  emitEvent(message: MiniEvent, client?: Socket) {
    if (client) {
      client.emit(SocketEvents.MiniEvent, message);
    } else {
      this.clientList.forEach((clientItem) => {
        clientItem.emit(SocketEvents.MiniEvent, message);
      });
    }
  }

  @OnEvent(EmitterEvents.MINI_EVENT)
  handleMiniEvent(payload: MiniEventEvent) {
    this.emitEvent(payload);
  }
}
