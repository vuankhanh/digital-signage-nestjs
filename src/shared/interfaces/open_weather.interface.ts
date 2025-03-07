import { Tstore } from "./store.interface";

export interface IOpenWeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  hourly: THourly[];
}

type TWeather = {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export type THourly = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: TWeather[];
  pop: number;
  rain?: { "1h": number };
}

export class OpenWeather {
  description: string;
  icon: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  constructor(store: Tstore, hourly: THourly) {
    this.description = hourly.weather[0].description;
    this.icon = hourly.weather[0].icon;
    this.temp = hourly.temp;
    this.tempMin = hourly.temp;
    this.tempMax = hourly.temp;
    this.humidity = hourly.humidity;
    this.windSpeed = hourly.wind_speed;
  }
}