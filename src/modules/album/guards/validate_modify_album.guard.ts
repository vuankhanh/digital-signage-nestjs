import { BadRequestException, CanActivate, ConflictException, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AlbumService } from '../album.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidateModifyAlbumGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly albumService: AlbumService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];
    const checkContentType: boolean = contentType && contentType.includes('multipart/form-data');

    const id = request.params.id;
    if (!id || !checkContentType) {
      return false;
    }

    const album = await this.albumService.findById(id);

    if (!album) {
      throw new BadRequestException('Album not found');
    };

    if(!album.relativePath) {
      throw new InternalServerErrorException('Album relative path not found');
    }

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = album.relativePath;
    
    return true;
  }
}
