import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdArrayPipe implements PipeTransform {
  constructor(private readonly propertyTransform: string) { }
  transform(value: any, metadata: ArgumentMetadata) {
    value[this.propertyTransform] = value[this.propertyTransform].map((id: string) => new mongoose.Types.ObjectId(id))
    return value;
  }
}
