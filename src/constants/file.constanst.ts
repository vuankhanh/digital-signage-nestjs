import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from 'multer';
import * as fse from 'fs-extra';

import toNoAccentVnHepler from '../shared/helpers/convert_vietnamese_to_no_accents.helper';
import { BadRequestException } from "@nestjs/common";
import { IFileType } from "src/shared/interfaces/files.interface";

const fileFilter = (req, file, cb) => {
  const match = ['image/png', 'image/jpeg', 'video/mp4', 'video/quicktime', 'video/webm'];
  if (match.indexOf(file.mimetype) === -1) {
    return cb(new BadRequestException('Invalid file type'), false);
  }
  return cb(null, true);
}

export const memoryStorageMulterOptions: MulterOptions = {
  storage: multer.memoryStorage(),
  fileFilter
}

const imageEnums = ['webp', 'jpeg', 'png'] as const;
const videoEnums = ['mp4', 'quicktime', 'webm'] as const;

export const imageTypes: { [key in typeof imageEnums[number]]: IFileType } = {
  webp: {
    type: 'image/webp',
    extension: 'webp'
  },
  jpeg: {
    type: 'image/jpeg',
    extension: 'jpeg'
  },
  png: {
    type: 'image/png',
    extension: 'png'
  },
};

export const videoTypes: { [key in typeof videoEnums[number]]: IFileType } = {
  mp4: {
    type: 'video/mp4',
    extension: 'mp4'
  },
  quicktime: {
    type: 'video/quicktime',
    extension: 'mov'
  },
  webm: {
    type: 'video/webm',
    extension: 'webm'
  }
};

export const imageSize = {
  logo: {
    width: 500,
    height: 500
  },
  imgMarketing: {
    width: 1920,
    height: 1080
  },
  hightlightMarketing: {
    width: 1920,
    height: 389
  }
}