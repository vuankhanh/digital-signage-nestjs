import { BadRequestException, Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Album } from './schema/album.schema';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IMedia } from 'src/shared/interfaces/media.interface';
import { Media, MediaDocument } from './schema/media.schema';
import { SortUtil } from 'src/shared/utils/sort_util';
import { FileHelper } from 'src/shared/helpers/file.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlbumService implements IBasicService<Album> {
  private albumFoler: string;
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.album');
  }

  async checkExistAlbum(query: Object) {
    return await this.albumModel.countDocuments(query);
  }

  async create(data: Album) {
    data.media = data.media.map(file => {
      return { ...file, _id: new Types.ObjectId() } as MediaDocument
    });
    const album = new this.albumModel(data);
    await album.save();
    return album;
  }

  async getAll(page: number, size: number) {
    const countTotal = await this.albumModel.countDocuments({});
    const albumsAggregate = await this.albumModel.aggregate(
      [
        {
          $addFields: {
            mediaItems: { $sum: { $size: "$media" } }
          }
        }, {
          $project: {
            media: 0
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: albumsAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    return metaData;
  }

  async getDetail(query: Object) {
    const album = await this.tranformToDetaiData(query);
    return album;
  }

  async replace(query: Object, data: Album) {
    const album = await this.albumModel.findOneAndUpdate(query, data, { new: true });
    return album;
  }

  async addNewFiles(
    filterQuery: Object,
    newFiles: Array<IMedia> = []
  ) {
    if (!newFiles.length) {
      throw new Error('No new files to add');
    }

    newFiles = newFiles.map(file => {
      return { ...file, _id: new Types.ObjectId() }
    })
    const updateQuery = {
      $push: {
        media: { $each: newFiles }
      }
    };

    await this.albumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async removeFiles(
    filterQuery: Object,
    filesWillRemove: Array<string | mongoose.Types.ObjectId> = [],
  ) {
    if (!filesWillRemove.length) {
      throw new Error('No files to remove');
    }

    const updateQuery = {
      $pull: {
        media: { _id: { $in: filesWillRemove } }
      }
    }

    //Lọc ra danh sách file cục bộ cần xóa
    await this.filterMediaItems(filesWillRemove).then(async mediaUrls => {
      //Xóa file
      await FileHelper.removeMediaFiles(this.albumFoler, mediaUrls);
    });

    await this.albumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async itemIndexChange(filterQuery: Object, itemIndexChanges: Array<string | mongoose.Types.ObjectId>) {
    const album = await this.albumModel.findOne(filterQuery);
    if (!album) {
      throw new Error('Album not found');
    }
    album.media = album.media.filter(media => media);
    album.media = SortUtil.sortDocumentArrayByIndex<Media>(album.media as Array<MediaDocument>, itemIndexChanges);

    await album.save();

    const updatedAlbum = await this.tranformToDetaiData(filterQuery);
    return updatedAlbum;
  }

  async setHighlightItem(filterQuery: Object, highlightItemId: mongoose.Types.ObjectId) {
    filterQuery['media._id'] = highlightItemId;
    // Find the album using the filter query
    const album = await this.albumModel.findOne(filterQuery);
    if (!album) {
      throw new BadRequestException('Album not found');
    }
    album.media = album.media.filter(media => media);
    const item = album.media.find(media => media._id.equals(highlightItemId));
    const isHighlight = !item.isHighlight;

    await this.albumModel.findOneAndUpdate(filterQuery, {
      $set: {
        'media.$.isHighlight': isHighlight
      }
    });

    const updatedAlbum = await this.tranformToDetaiData(filterQuery);
    return updatedAlbum;
  }

  async modify(query: Object, data: Partial<Album>) {
      const album = await this.albumModel.findOneAndUpdate(query, data, { new: true });
      return album;
    }

  async remove(query: Object) {
      const album = await this.albumModel.findOneAndDelete(query);
      if (album?.relativePath) {
        await FileHelper.removeFolder(this.albumFoler, album.relativePath);
      }
      return album;
    }

  private async tranformToDetaiData(conditional: Object): Promise<HydratedDocument<Album>> {
    return await this.albumModel.aggregate(
      [
        {
          $match: conditional
        }, {
          $addFields: {
            mediaItems: { $sum: { $size: "$media" } }
          }
        }, {
          $replaceWith: {
            $setField: {
              field: "media",
              input: "$$ROOT",
              value: {
                $sortArray: { input: "$media", sortBy: { type: 1 } }
              }
            }
          }
        }, {
          $limit: 1
        }
      ]
    ).then(res => {
      return res[0]
    });
  }

  async filterMediaItems(itemIds: Array<mongoose.Types.ObjectId | string>): Promise<Array<{ url: string, thumbnailUrl: string }>> {
    return this.albumModel.aggregate([
      { $match: {} },
      {
        $project: {
          media: {
            $filter: {
              input: '$media',
              as: 'item',
              cond: { $in: ['$$item._id', itemIds.map(id => new Types.ObjectId(id))] }
            }
          }
        }
      },
      {
        $project: {
          media: {
            $map: {
              input: '$media',
              as: 'item',
              in: { url: '$$item.url', thumbnailUrl: '$$item.thumbnailUrl' }
            }
          }
        }
      }
    ]).then(res => {
      return res[0] ? res[0].media : [];
    });
  }
}
