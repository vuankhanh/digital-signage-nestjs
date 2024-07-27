import { BadRequestException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HightlightMarketingService } from '../hightlight-marketing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidateModifyHightlightMarketingGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly hightlightMarketingService: HightlightMarketingService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const hightlightMarketing = await this.hightlightMarketingService.getDetail({});

    if (!hightlightMarketing) {
      throw new BadRequestException('Hightlight Marketing not found');
    };

    if(!hightlightMarketing.relativePath) {
      throw new InternalServerErrorException('Hightlight Marketing relative path not found');
    }

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};

    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = hightlightMarketing.relativePath;
    
    return true;
  }
}
