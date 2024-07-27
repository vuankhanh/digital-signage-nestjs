import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { HightlightMarketingService } from '../hightlight-marketing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidateCreateHightlightMarketingGuard implements CanActivate {
  constructor(
    private readonly hightlightMarketingService: HightlightMarketingService,
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

    const isExists = await this.hightlightMarketingService.getDetail({});
    if (isExists) {
      throw new ConflictException('Hightligh Marketing already exists');
    };

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    
    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = 'hightlightMarketing';
    return true;
  }
}
