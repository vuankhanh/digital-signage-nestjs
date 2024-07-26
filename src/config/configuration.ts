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
    icon: join(__dirname, '../../assets/icon/svg').replace(/\\/g, "/")
  }

  const config = process.env.NODE_ENV?.trim() === 'pro' ? pro : dev;

  return { ...config, folder };
}