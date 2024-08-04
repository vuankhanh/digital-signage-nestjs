import { Module } from '@nestjs/common';
import { HightlightMarketingService } from './hightlight-marketing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateCreateHightlightMarketingGuard } from './guards/validate_create_hightlight-marketing.guard';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { HightlightMarketing, hightlightMarketingSchema } from './schema/hightlight-marketing.schema';
import { HightlightMarketingController } from './hightlight-marketing.controller';
import { ChangeUploadfileNamePipe } from 'src/shared/pipes/change-uploadfile-name.pipe';
import { FileProcessPipe } from 'src/shared/pipes/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/pipes/disk-storage.pipe';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HightlightMarketing.name,
        schema: hightlightMarketingSchema,
        collection: HightlightMarketing.name.toLowerCase()
      },
    ]),
    NotificationModule
  ],
  controllers: [HightlightMarketingController],
  providers: [
    HightlightMarketingService,
    ValidateCreateHightlightMarketingGuard,
    ConfigService,
    AuthGuard,

    ChangeUploadfileNamePipe,
    FileProcessPipe,
    DiskStoragePipe
  ],
  exports: [HightlightMarketingService]
})
export class HightlightMarketingModule {}
