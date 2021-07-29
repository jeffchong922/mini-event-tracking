import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMiniEventDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  behavior: string;

  @IsString()
  @IsOptional()
  comments: string;

  constructor(id: string, behavior: string, comments: string = null) {
    this.id = id;
    this.behavior = behavior;
    this.comments = comments;
  }
}
