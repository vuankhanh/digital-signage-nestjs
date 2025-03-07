import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { IOpenWeatherResponse, THourly } from 'src/shared/interfaces/open_weather.interface';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Open_Weather_Map, OpenWeatherMapDocument } from './schema/open-weather-map.schema';
import { Model } from 'mongoose';
import { Tstore } from 'src/shared/interfaces/store.interface';

@Injectable()
export class OpenWeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Open_Weather_Map.name) private openWeatherMapModel: Model<Open_Weather_Map>,
  ) { }

  async getWeather() {
    const storeCoordinatesLat = this.configService.get('storeCoordinates.lat');
    const storeCoordinatesLng = this.configService.get('storeCoordinates.lng');
    const openWeatherUrl = this.configService.get('openWeather.url');
    const openWeatherApiKey = this.configService.get('openWeather.apiKey');
    const openWeatherUnits = this.configService.get('openWeather.units');
    const openWeatherExclude = this.configService.get('openWeather.exclude');
    const openWeatherLang = this.configService.get('openWeather.lang');

    const config: AxiosRequestConfig = {
      params: {
        lat: storeCoordinatesLat,
        lon: storeCoordinatesLng,
        appid: openWeatherApiKey,
        units: openWeatherUnits,
        exclude: openWeatherExclude,
        lang: openWeatherLang,
      }
    }
    try {
      return await firstValueFrom(
        this.httpService.get<IOpenWeatherResponse>(openWeatherUrl, config).pipe(
          map((resp) => resp.data as IOpenWeatherResponse),
        ));
    } catch(error) {
      throw new Error(error.message);
    }
  }

  async getIconWeather(icon: string, res: Response) {
    const openWeatherIconUrl = this.configService.get('openWeather.iconUrl');
    const fullUrl = `${openWeatherIconUrl}/${icon}@2x.png`;
    try {
      const response = await firstValueFrom(this.httpService.get(fullUrl, { responseType: 'stream' }));
      response.data.pipe(res);
    } catch(error) {
      console.log(error);
      throw new HttpException('Error fetching weather icon', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addNewHourly(store: Tstore, weatherHourly: THourly[]): Promise<number> {
    try {
      let count = 0;
      for (const hourly of weatherHourly) {
        const result = await this.openWeatherMapModel.updateOne(
          { 'store.name': store.name, 'hourly.dt': hourly.dt },
          { $set: {store, hourly} },
          { upsert: true }
        )
        if (result.upsertedCount === 1) count++;
      }
      return count;
    } catch (error) {
      console.error('Error saving weather data:', error.message);
      throw new HttpException('Error saving weather data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getNextHourWeather(): Promise<OpenWeatherMapDocument> {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    try {
      const nextHourWeather = await this.openWeatherMapModel.findOne({
        'hourly.dt': { $gt: currentTime }
      }).sort({ 'hourly.dt': 1 }).exec();

      if (!nextHourWeather) {
        throw new HttpException('No weather data found for the next hour', HttpStatus.NOT_FOUND);
      }

      return nextHourWeather;
    } catch (error) {
      console.error('Error fetching next hour weather data:', error.message);
      throw new HttpException('Error fetching next hour weather data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
