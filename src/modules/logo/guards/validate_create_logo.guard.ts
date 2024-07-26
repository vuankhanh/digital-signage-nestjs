import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { LogoService } from '../logo.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidateCreateLogoGuard implements CanActivate {
  constructor(
    private readonly logoService: LogoService,
    private readonly configService: ConfigService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];
    const checkContentType: boolean = contentType && contentType.includes('multipart/form-data');
    
    if (!checkContentType) {
      return false;
    }

    const isExists = await this.logoService.getDetail({});
    if (isExists) {
      throw new ConflictException('Logo already exists');
    };

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    
    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = 'logo';
    return true;
  }
}
