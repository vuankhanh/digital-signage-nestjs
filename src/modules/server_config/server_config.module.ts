import { Module } from '@nestjs/common';
import { ServerConfigService } from './server_config.service';
import { ServerConfigController } from './server_config.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [ServerConfigController],
  providers: [ServerConfigService],
})
export class ServerConfigModule {}
