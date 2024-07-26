import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { TProcessedMedia } from '../interfaces/files.interface';
import { IMedia } from '../interfaces/media.interface';
import { DiskStorageUtil } from '../utils/disk_storage.util';
import { REQUEST } from '@nestjs/core';

@Injectable({
  scope: Scope.REQUEST,
})
export class DiskStoragePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request
  ) { }
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
