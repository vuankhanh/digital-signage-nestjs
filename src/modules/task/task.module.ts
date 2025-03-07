import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    OpenWeatherModule
  ],
  providers: [
    ConfigService,
    TaskService
  ]
})
export class TaskModule {}
