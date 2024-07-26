import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DiskStorageUtil {
  static saveToDisk(rootPath: string, file: Express.Multer.File): string {
    if (!fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath);
    }
    const filePath = path.join(rootPath, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  }
}