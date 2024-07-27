import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Logo } from './schema/logo.schema';

@Injectable()
export class LogoService implements IBasicService<Logo> {
  constructor(
    @InjectModel(Logo.name) private logoModel: Model<Logo>
  ) { }

  async checkExistLogo(query: Object) {
    return await this.logoModel.countDocuments(query);
  }

  async create(data: Logo) {
    await this.logoModel.updateOne({}, data, { upsert: true });
    const album = await this.logoModel.findOne();
    return album;
  }

  async getAll(page: number, size: number) {
    const countTotal = await this.logoModel.countDocuments({});
    const albumsAggregate = await this.logoModel.aggregate(
      [
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
    const album = await this.logoModel.findOne(query);
    return album;
  }

  async replace(query: Object, data: Logo) {
    const milestone = await this.logoModel.findOneAndUpdate(query, data, { new: true });
    return milestone;
  }

  async modify(query: Object, data: Partial<Logo>) {
    const milestone = await this.logoModel.findOneAndUpdate(query, data, { new: true });
    return milestone;
  }

  async remove(query: Object) {
    const milestone = await this.logoModel.findOneAndDelete(query);
    return milestone;
  }
}
