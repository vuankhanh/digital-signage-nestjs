import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMedia } from "src/shared/interfaces/media.interface";

const enumType = ['image', 'video'];

@Schema({
  collection: 'hightlight-marketing',
  timestamps: true
})
export class HightlightMarketing implements IMedia {
  @Prop({
    type: String,
    required: true,
  })
  url: string;

  @Prop({
    type: String,
    required: true
  })
  thumbnailUrl: string;

  @Prop({
    type: String,
    required: true
  })
  relativePath: string;

  @Prop({
    type: String,
    required: true
  })
  name: string;

  @Prop({
    type: String
  })
  description: string;

  @Prop({
    type: String
  })
  alternateName: string;

  @Prop({
    type: String,
    enum: enumType,
    required: true
  })
  type: 'image';
  
  constructor(
    url: string,
    thumbnailUrl: string,
    relativePath: string,
    name: string,
    description: string,
    alternateName: string,
    type: 'image'
  ) {
    this.url = url;
    this.thumbnailUrl = thumbnailUrl;
    this.relativePath = relativePath;
    this.name = name;
    this.description = description;
    this.alternateName = alternateName;
    this.type = type;
  }
}

export const hightlightMarketingSchema = SchemaFactory.createForClass(HightlightMarketing);