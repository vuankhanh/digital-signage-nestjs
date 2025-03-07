import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import { Tstore } from 'src/shared/interfaces/store.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly openWeatherService: OpenWeatherService
  ) { }

  @Cron('0 */2 * * *')
  async handleCron() {
    const store: Tstore = this.configService.get('storeCoordinates');
    const weather = await this.openWeatherService.getWeather();

    const newHourlyIsUpdated: number = await this.openWeatherService.addNewHourly(store, weather.hourly);

    this.logger.debug(`Số lượng hourly mới: ${newHourlyIsUpdated}`);
  }
}
