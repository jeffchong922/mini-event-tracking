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
}
