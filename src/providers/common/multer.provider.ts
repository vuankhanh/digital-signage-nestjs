import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";

@Injectable()
export class MulterConfigProvider implements MulterOptionsFactory {
  constructor(
    private configService: ConfigService
) { }
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: this.configService.get('folder.album'),
    };
  }
}