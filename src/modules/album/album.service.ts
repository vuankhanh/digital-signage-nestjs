import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Album } from './schema/album.schema';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IMedia } from 'src/shared/interfaces/media.interface';

@Injectable()
export class AlbumService implements IBasicService<Album> {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>
  ) { }

  async checkExistAlbum(query: Object) {
    return await this.albumModel.countDocuments(query);
  }

  async create(data: Album) {
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

  async modifyMedias(
    query: Object,
    filesWillRemove: Array<mongoose.Types.ObjectId | string>,
    newFiles: Array<IMedia>
  ) {
    const arrPromise: Array<Promise<any>> = [];

    const parameter = { $set: {} };

    if (newFiles.length) {
      newFiles = newFiles.map(file => {
        return { ...file, _id: new Types.ObjectId() }
      })
      parameter['$push'] = {
        media: { $each: newFiles }
      }
    }

    const updateAlbum = this.albumModel.findOneAndUpdate(query, parameter, { safe: true, new: true });
    arrPromise.push(updateAlbum);

    if (filesWillRemove?.length) {
      const removeValueQuery = {
        $pull: {
          media: { _id: { $in: filesWillRemove } }
        }
      }
      const removeItem = this.albumModel.findOneAndUpdate(query, removeValueQuery, { safe: true, new: true });
      arrPromise.push(removeItem);
    }

    await Promise.all(arrPromise);
    const album = await this.tranformToDetaiData({});
    return album;
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
