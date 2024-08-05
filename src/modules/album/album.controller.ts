import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { AlbumDto } from './dto/album.dto';
import { FilesProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { FilesProcessPipe } from 'src/shared/pipes/file_process.pipe';
import { Album } from './schema/album.schema';
import { IMedia } from 'src/shared/interfaces/media.interface';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ValidateModifyAlbumGuard } from './guards/validate_modify_album.guard';
import { Request } from 'express';
import { memoryStorageMulterOptions } from 'src/constants/file.constanst';
import { ChangeUploadfilesNamePipe } from 'src/shared/pipes/change-uploadfile-name.pipe';
import { DiskStoragePipe } from 'src/shared/pipes/disk-storage.pipe';
import { Types } from 'mongoose';
import { ParseObjectIdArrayPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { NotificationGateway } from '../notification/notification.gateway';
import { AlbumModifyItemIndexChangeDto, AlbumModifyRemoveFilesDto } from './dto/album_modify.dto';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async get() {
    return await this.albumService.getDetail({});
  }

  @Post()
  @UseGuards(AuthGuard, ValidateCreateAlbumGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor,
    FormatResponseInterceptor
  )
  async create(
    @Req() req: Request,
    @Body() body: AlbumDto,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const relativePath = req['customParams'].relativePath;

    const mainMedia = medias[body.isMain] || medias[0];
    const thumbnail = mainMedia.thumbnailUrl;

    const albumDoc: Album = new Album(
      thumbnail,
      medias,
      relativePath
    )
    const createdAlbum = await this.albumService.create(albumDoc);
    this.notificationGateway.emitDataChange('album', 'create', createdAlbum);
    return createdAlbum;
  }

  @Patch('add-new-files')
  @UseGuards(AuthGuard, ValidateModifyAlbumGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor,
    FormatResponseInterceptor
  )
  async addNewFiles(
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const updatedAlbums = await this.albumService.addNewFiles({}, medias);
    this.notificationGateway.emitDataChange('album', 'modify', updatedAlbums);
    return updatedAlbums;
  }

  @Patch('remove-files')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FormatResponseInterceptor
  )
  async removeFiles(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: AlbumModifyRemoveFilesDto,
  ) {
    const updatedAlbums = await this.albumService.removeFiles({}, body.filesWillRemove);
    this.notificationGateway.emitDataChange('album', 'modify', updatedAlbums);
    return updatedAlbums;
  }

  @Patch('item-index-change')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FormatResponseInterceptor
  )
  async itemIndexChange(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('newItemIndexChange')) body: AlbumModifyItemIndexChangeDto,
  ) {
    const updatedAlbums = await this.albumService.itemIndexChange({}, body.newItemIndexChange);
    this.notificationGateway.emitDataChange('album', 'modify', updatedAlbums);
    return updatedAlbums;
  }

  @Delete()
  @UseGuards(AuthGuard, ValidateModifyAlbumGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async remove() {
    return await this.albumService.remove({});
  }

}
