import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlbumModifyDto } from 'src/modules/album/dto/album_modify.dto';

@Injectable()
export class ParseObjectIdArrayPipe implements PipeTransform {
  transform(value: AlbumModifyDto, metadata: ArgumentMetadata) {
    value.filesWillRemove = value.filesWillRemove?.map(id => new Types.ObjectId(id))
    return value;
  }
}
