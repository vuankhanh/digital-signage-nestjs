import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Album } from './schema/album.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import toNoAccentVnHepler from '../../shared/helpers/convert_vietnamese_to_no_accents.helper';
import { IMedia } from 'src/shared/interfaces/media.interface';
import { Media } from './schema/media.schema';

@Injectable()
export class AlbumService implements IBasicService<Album> {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<Media>,
    @InjectModel(Album.name) private albumModel: Model<Album>
  ) { }

  async checkExistAlbum(query: Object) {
    return await this.albumModel.countDocuments(query);
  }

  async findById(id: mongoose.Types.ObjectId) {
    return await this.albumModel.findById(id);
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

  async replace(id: string, data: Album) {
    const milestone = await this.albumModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async modifyMedias(
    id: string,
    filesWillRemove: Array<mongoose.Types.ObjectId | string>,
    newFiles: Array<IMedia>
  ) {
    const arrPromise: Array<Promise<any>> = [];

    const query = { $set: {} };

    if (newFiles.length) {
      const newItems = await this.mediaModel.insertMany(newFiles);
      query['$push'] = {
        media: { $each: newItems }
      }
    }

    const updateAlbum = this.albumModel.findByIdAndUpdate(id, query, { safe: true, new: true });
    arrPromise.push(updateAlbum);

    if (filesWillRemove?.length) {
      const removeValueQuery = {
        $pull: {
          media: { _id: { $in: filesWillRemove } }
        }
      }
      const removeItem = this.albumModel.findByIdAndUpdate(id, removeValueQuery, { safe: true, new: true });
      arrPromise.push(removeItem);
    }

    await Promise.all(arrPromise);
    const album = await this.tranformToDetaiData({ _id: new mongoose.Types.ObjectId(id) });
    return album;
  }

  async modify(id: string, data: Partial<Album>) {
    const milestone = await this.albumModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async remove(id: string) {
    const milestone = await this.albumModel.findByIdAndDelete(id);
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
