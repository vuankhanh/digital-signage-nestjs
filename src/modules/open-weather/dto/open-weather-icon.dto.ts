import { IsString } from "class-validator";

export class OpenWeatherIconDto {
  @IsString()
  icon: string;
}