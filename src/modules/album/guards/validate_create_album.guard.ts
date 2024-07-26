import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { AlbumService } from '../album.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidateCreateAlbumGuard implements CanActivate {
  constructor(
    private readonly albumService: AlbumService,
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

    const isExists = await this.albumService.checkExistAlbum({});
    if (isExists) {
      throw new ConflictException('Album already exists');
    };

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    
    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = 'imgMarketing';
    return true;
  }
}
