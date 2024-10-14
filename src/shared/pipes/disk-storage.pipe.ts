import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import * as fs from 'fs';
import { TProcessedMedia } from '../interfaces/files.interface';
import { IMedia } from '../interfaces/media.interface';
import { DiskStorageUtil } from '../utils/disk_storage.util';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable({
  scope: Scope.REQUEST,
})
export class DiskStoragePipe implements PipeTransform {
  private errorThumbnailUrl: string;
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {
    const assetsFolder = this.configService.get<string>('folder.assets');
    this.errorThumbnailUrl = assetsFolder + '/img/warning-img.webp';
  }
  transform(
    processedMedia: TProcessedMedia | TProcessedMedia[]
  ): IMedia | Array<IMedia> {
    return Array.isArray(processedMedia) ? processedMedia.map(media => this.saveToDisk(media)) : this.saveToDisk(processedMedia);
  }

  private saveToDisk(processedMedia: TProcessedMedia): IMedia {
    const customParams = this.request['customParams'];
    const destination = customParams.albumFolder;
    const relativePath = customParams.relativePath;
    const absolutePath = destination + '/' + relativePath;

    const file = processedMedia.file;
    DiskStorageUtil.saveToDisk(absolutePath, file);

    const thumbnail = processedMedia.thumbnail;

    if(thumbnail.buffer === null) {
      const thumbnailBuffer: Buffer = fs.readFileSync(this.errorThumbnailUrl);
      thumbnail.buffer = thumbnailBuffer;
    }

    DiskStorageUtil.saveToDisk(absolutePath, thumbnail);

    const media: IMedia = {
      url: relativePath + '/' + file.originalname,
      thumbnailUrl: relativePath + '/' + thumbnail.originalname,
      name: file.originalname,
      description: '',
      alternateName: '',
      type: file.mimetype.includes('image') ? 'image' : 'video',
    }

    return media;
  }
}
