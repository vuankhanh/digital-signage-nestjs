import mongoose from "mongoose";
import { ILocation } from "./location.interface";

export interface IMilestone {
  numericalOrder: number;
  name: string;
  address: string;
  dateTime: Date;
  coordinates: ILocation;
  albumId: mongoose.Types.ObjectId | string | null;
}