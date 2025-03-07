import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MediaDocument } from "./media.schema";

export type AlbumDocument = HydratedDocument<Album>;

@Schema({
  collection: 'album',
  timestamps: true
})
export class Album {
  @Prop({
    type: String,
    required: true
  })
  thumbnail: string;

  @Prop({
    type: Array<MediaDocument>
  })
  media: Array<MediaDocument>;

  @Prop({
    type: String,
    required: true
  })
  relativePath: string;

  constructor(thumbnail: string, media: Array<MediaDocument>, relativePath: string) {
    this.thumbnail = thumbnail;
    this.media = media;
    this.relativePath = relativePath;
  }
}

export const albumSchema = SchemaFactory.createForClass(Album);