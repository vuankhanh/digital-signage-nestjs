import { join } from "path";

export default () => {
  const dev = {
    app: {
      port: Number(process.env.DEV_APP_PORT) || 3000
    },
    db: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: Number(process.env.DEV_DB_PORT) || 27017,
      name: process.env.DEV_DB_NAME || 'marketing_bep4than'
    }
  }

  const pro = {
    app: {
      port: Number(process.env.PRO_APP_PORT)
    },
    db: {
      host: process.env.PRO_DB_HOST,
      port: Number(process.env.PRO_DB_PORT),
      name: process.env.PRO_DB_NAME || 'marketing_bep4than'
    }
  }

  const folder = {
    album: join(__dirname + '../../..', process.env.FILE_FOLDER, 'Album').replace(/\\/g, "/"),
    assets: join(__dirname + '../../..', process.env.ASSETS_FOLDER).replace(/\\/g, "/"),
  }

  const storeCoordinates = {
    name: process.env.BEP4THAN_LOCATION_NAME,
    lat: process.env.BEP4THAN_LOCATION_LAT,
    lng: process.env.BEP4THAN_LOCATION_LON
  };

  const  openWeather = {
    url: process.env.OPENWEATHERMAP_API_URL,
    apiKey: process.env.OPENWEATHERMAP_API_KEY,
    lang: process.env.OPENWEATHERMAP_LANG || 'vi',
    units: process.env.OPENWEATHERMAP_UNITS || 'metric',
    exclude: process.env.OPENWEATHERMAP_EXCLUDE || 'current,minutely,daily,alerts',
    iconUrl: process.env.OPENWEATHERMAP_URL_ICON
  }

  const config = process.env.NODE_ENV?.trim() === 'pro' ? pro : dev;

  return { ...config, folder, storeCoordinates, openWeather };
}