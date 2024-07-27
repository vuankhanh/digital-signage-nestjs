import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { HightlightMarketing } from './schema/hightlight-marketing.schema';

@Injectable()
export class HightlightMarketingService implements IBasicService<HightlightMarketing> {
  constructor(
    @InjectModel(HightlightMarketing.name) private hightlightMarketingModel: Model<HightlightMarketing>
  ) { }

  async checkExistLogo(query: Object) {
    return await this.hightlightMarketingModel.countDocuments(query);
  }

  async create(data: HightlightMarketing) {
    await this.hightlightMarketingModel.updateOne({}, data, { upsert: true });
    const album = await this.hightlightMarketingModel.findOne();
    return album;
  }

  async getAll(page: number, size: number) {
    const countTotal = await this.hightlightMarketingModel.countDocuments({});
    const albumsAggregate = await this.hightlightMarketingModel.aggregate(
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
    const album = await this.hightlightMarketingModel.findOne(query);
    return album;
  }

  async replace(query: Object, data: HightlightMarketing) {
    const milestone = await this.hightlightMarketingModel.findOneAndUpdate(query, data, { new: true });
    return milestone;
  }

  async modify(query: Object, data: Partial<HightlightMarketing>) {
    const milestone = await this.hightlightMarketingModel.findOneAndUpdate(query, data, { new: true });
    return milestone;
  }

  async remove(query: Object) {
    const milestone = await this.hightlightMarketingModel.findOneAndDelete(query);
    return milestone;
  }
}
