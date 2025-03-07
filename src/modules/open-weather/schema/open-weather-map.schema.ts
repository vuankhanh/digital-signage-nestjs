import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { THourly } from "src/shared/interfaces/open_weather.interface";
import { Tstore } from "src/shared/interfaces/store.interface";

export type OpenWeatherMapDocument = HydratedDocument<Open_Weather_Map>;

@Schema({
  timestamps: true
})
export class Open_Weather_Map {
  @Prop({
    type: Object,
    required: true
  })
  store: Tstore;

  @Prop(
    {
      type: Object,
      required: true
    }
  )
  hourly: THourly;

  constructor(store: Tstore, hourly: THourly) {
    this.store = store;
    this.hourly = hourly;
  }
}

export const openWeatherMapSchema = SchemaFactory.createForClass(Open_Weather_Map);

// Create a unique index on store.name and hourly.dt
openWeatherMapSchema.index({ 'store.name': 1, 'hourly.dt': 1 }, { unique: true });