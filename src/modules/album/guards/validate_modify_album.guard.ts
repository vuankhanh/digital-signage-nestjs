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

    const album = await this.albumService.getDetail({});

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

@Injectable()
export class ValidateModifyItemIndexchangeAlbumGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const { newItemIndexChange } = request.body;
    if( !newItemIndexChange || newItemIndexChange.length === 0) {
      throw new BadRequestException('New item index change not found');
    }

    return true;
  }
}