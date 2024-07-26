import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { AlbumModifyDto } from './dto/album_modify.dto';
import { MongoIdDto } from 'src/shared/dto/mongodb.dto';
import { ValidateModifyAlbumGuard } from './guards/validate_modify_album.guard';
import { PagingDto } from 'src/shared/dto/paging.dto';
import { Request } from 'express';
import { memoryStorageMulterOptions } from 'src/constants/file.constanst';
import { ChangeUploadfilesNamePipe } from 'src/shared/pipes/change-uploadfile-name.pipe';
import { DiskStoragePipe } from 'src/shared/pipes/disk-storage.pipe';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
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
    FilesInterceptor('many-files', null, memoryStorageMulterOptions),
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
    return await this.albumService.create(albumDoc);
  }

  // @Patch(':id')
  // @UseGuards(ValidateModifyAlbumGuard)
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(
  //   FilesInterceptor('many-files', null, modificationMulterOptions),
  //   FormatResponseInterceptor
  // )
  // async modify(
  //   @Param(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto,
  //   @Body(new ValidationPipe({ transform: true })) body: AlbumModifyDto,
  //   @UploadedFiles(FilesProcessPipe) medias: Array<IMedia>
  // ) {
  //   return await this.albumService.modifyMedias(id, body.filesWillRemove, medias);
  // }

}
