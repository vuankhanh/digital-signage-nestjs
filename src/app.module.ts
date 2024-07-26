import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ServerConfigModule } from './modules/server_config/server_config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbProvider } from './providers/database/mongodb.provider';
import { AlbumModule } from './modules/album/album.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigProvider } from './providers/common/multer.provider';
import { LogoModule } from './modules/logo/logo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbProvider,
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfigProvider,
    }),
    AuthModule,
    ServerConfigModule,
    AlbumModule,
    LogoModule
  ]
})
export class AppModule {
  logger: Logger = new Logger(AppModule.name);
  static port: number;
  constructor(
    private configService: ConfigService
  ) {
    AppModule.port = this.configService.get<number>('app.port');
  }
}
