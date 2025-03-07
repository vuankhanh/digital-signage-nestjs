import { Module } from '@nestjs/common';
import { OpenWeatherService } from './open-weather.service'; import { OpenWeatherController } from './open-weather.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Open_Weather_Map, openWeatherMapSchema } from './schema/open-weather-map.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Open_Weather_Map.name,
        schema: openWeatherMapSchema,
        collection: Open_Weather_Map.name.toLowerCase()
      }
    ]),
  ],
  providers: [
    ConfigService,
    OpenWeatherService,
  ],
  controllers: [OpenWeatherController],
  exports: [OpenWeatherService]
})
export class OpenWeatherModule { }
