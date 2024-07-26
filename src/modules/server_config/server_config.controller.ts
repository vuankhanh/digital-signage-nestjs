import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ServerConfigService } from './server_config.service';
import { IConfiguration } from 'src/shared/interfaces/config.interface';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
const cacheServerConfigTTL = 5 * 18000 * 1000; // 5 hours
@Controller('config')
export class ServerConfigController {
  constructor(
    private readonly serverConfigService: ServerConfigService
  ) { }

  @Get()
  @CacheKey('server_config')
  @CacheTTL(cacheServerConfigTTL)
  @UseInterceptors(CacheInterceptor, FormatResponseInterceptor)
  async getConfig(): Promise<IConfiguration> {
    return await this.serverConfigService.getServerConfig();
  }
}
