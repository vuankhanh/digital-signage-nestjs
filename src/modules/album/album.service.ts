import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Album } from './schema/album.schema';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IMedia } from 'src/shared/interfaces/media.interface';
import { Media, MediaDocument } from './schema/media.schema';
import { SortUtil } from 'src/shared/utils/sort_util';

@Injectable()
export class AlbumService implements IBasicService<Album> {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>
  ) { }

  async checkExistAlbum(query: Object) {
    return await this.albumModel.countDocuments(query);
  }

  async create(data: Album) {
    data.media = data.media.map(file => {
      return { ...file, _id: new Types.ObjectId() }
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
    const milestone = await this.albumModel.findOneAndUpdate(query, data, { new: true });
    return milestone;
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

    await this.albumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async itemIndexChange(filterQuery: Object, itemIndexChanges: Array<string | mongoose.Types.ObjectId>) {
    const album = await this.albumModel.findOne(filterQuery);
    if (!album) {
      throw new Error('Album not found');
    }

    album.media = SortUtil.sortDocumentArrayByIndex<Media>(album.media as Array<MediaDocument>, itemIndexChanges);

    await album.save();

    const updatedAlbum = await this.tranformToDetaiData(filterQuery);
    return updatedAlbum;
  }

  async modify(query: Object, data: Partial<Album>) {
    const milestone = await this.albumModel.findOneAndUpdate(query, data, { new: true });
    return milestone;
  }

  async remove(query: Object) {
    const milestone = await this.albumModel.findOneAndDelete(query);
    return milestone;
  }

  private async tranformToDetaiData(conditional: Object) {
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
}
