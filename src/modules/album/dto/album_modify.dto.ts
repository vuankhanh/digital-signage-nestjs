import { Transform, Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class AlbumModifyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'IsMain must be a number' })
  isMain: number;

  @IsOptional()
  @Transform(({ value }) => {
    return JSON.parse(value)
  }, { toClassOnly: true })
  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  filesWillRemove: string[];
}