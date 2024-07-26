import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMedia } from "src/shared/interfaces/media.interface";

const enumType = ['image', 'video'];

@Schema({
  timestamps: true
})
export class Media implements IMedia {
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
  type: 'image' | 'video';
}

export const mediaSchema = SchemaFactory.createForClass(Media);