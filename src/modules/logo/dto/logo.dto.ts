import { IsOptional, IsString } from "class-validator";

export class LogoDto {
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Alternate name must be a string' })
  alternateName: string;
}