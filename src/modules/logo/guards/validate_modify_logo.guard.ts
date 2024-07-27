import { BadRequestException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogoService } from '../logo.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidateModifyLogoGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly logoService: LogoService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const logo = await this.logoService.getDetail({});

    if (!logo) {
      throw new BadRequestException('Logo not found');
    };

    if(!logo.relativePath) {
      throw new InternalServerErrorException('Logo relative path not found');
    }

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};

    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = logo.relativePath;
    
    return true;
  }
}
