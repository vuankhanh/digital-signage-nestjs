import { Controller, Get, Param, Query, Res, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { OpenWeatherService } from './open-weather.service';
import { OpenWeatherIconDto } from './dto/open-weather-icon.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Tstore } from 'src/shared/interfaces/store.interface';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

@Controller('open-weather')
export class OpenWeatherController {
  constructor(
    private readonly configService: ConfigService,
    private readonly openWeatherService: OpenWeatherService
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getWeather() {
    const store: Tstore = this.configService.get('storeCoordinates');
    
    const weather = await this.openWeatherService.getWeather();

    const newWeather = await this.openWeatherService.addNewHourly(store, weather.hourly);
    return weather;
  }

  @Get('icon')
  @UsePipes(ValidationPipe)
  async getIconWeather(
    @Res() res: Response,
    @Query() param: OpenWeatherIconDto
  ) {
    const { icon } = param;
    const iconWeather = await this.openWeatherService.getIconWeather(icon, res);
    return iconWeather;
  }

  @Get('next-hour')
  @UseInterceptors(FormatResponseInterceptor)
  async getNextHourWeather() {
    const nextHourWeather = await this.openWeatherService.getNextHourWeather();
    return nextHourWeather;
  }
}