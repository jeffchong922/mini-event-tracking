import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateMiniEventDto } from 'src/dto/events/create-mini-event.dto';
import { EmitterEvents } from 'src/enums/emitter/emitter-events.enum';
import { MiniEvent } from 'src/interfaces/socket/mini-event.interface';

@Injectable()
export class EventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitAMiniEvent(event: MiniEvent) {
    const eventInstance = new CreateMiniEventDto(
      event.id,
      event.behavior,
      event.comments,
    );
    this.eventEmitter.emit(EmitterEvents.MINI_EVENT, eventInstance);
  }
}
