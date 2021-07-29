import { IsString } from 'class-validator';

export class CreateMiniEventDto {
  @IsString()
  id: string;

  @IsString()
  behavior: string;

  @IsString()
  comments: string;
}
