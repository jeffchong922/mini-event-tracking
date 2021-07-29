import { Injectable } from '@nestjs/common';
import { MiniEvent } from 'src/interfaces/socket/mini-event.interface';

@Injectable()
export class EventsService {
  emitAMiniEvent(event: MiniEvent) {
    console.log(event);
  }
}
