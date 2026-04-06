import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
