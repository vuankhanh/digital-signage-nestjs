import mongoose, { FlattenMaps, HydratedDocument } from "mongoose";
import { IPaging } from "./paging.interface";

//T is the DTO, M is the Model
export interface IBasicService<T> {
  create(data: T): Promise<HydratedDocument<T>>;
  getAll(page: number, size: number): Promise<{data: FlattenMaps<T>[], paging: IPaging}>;
  getDetail(id: mongoose.Types.ObjectId | string | Object): Promise<HydratedDocument<T>>;
  replace(id: mongoose.Types.ObjectId | string, data: T): Promise<HydratedDocument<T>>;
  modify(id: mongoose.Types.ObjectId | string, data: Partial<T>): Promise<HydratedDocument<T>>;
  remove(id: mongoose.Types.ObjectId | string): Promise<HydratedDocument<T>>;
}