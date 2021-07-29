import { Body, Controller, Post } from '@nestjs/common';
import { CreateMiniEventDto } from 'src/dto/events/create-mini-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('miniEvent')
  createMiniEvent(@Body() createMiniEvent: CreateMiniEventDto) {
    this.eventsService.emitAMiniEvent(createMiniEvent);
  }
}
