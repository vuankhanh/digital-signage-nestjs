import { Module } from '@nestjs/common';
import { LogoService } from './logo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateCreateLogoGuard } from './guards/validate_create_logo.guard';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Logo, logoSchema } from './schema/logo.schema';
import { LogoController } from './logo.controller';
import { ChangeUploadfileNamePipe } from 'src/shared/pipes/change-uploadfile-name.pipe';
import { FileProcessPipe } from 'src/shared/pipes/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/pipes/disk-storage.pipe';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Logo.name,
        schema: logoSchema,
        collection: Logo.name.toLowerCase()
      },
    ]),
    NotificationModule
  ],
  controllers: [LogoController],
  providers: [
    LogoService,
    ValidateCreateLogoGuard,
    ConfigService,
    AuthGuard,

    ChangeUploadfileNamePipe,
    FileProcessPipe,
    DiskStoragePipe
  ],
  exports: [LogoService]
})
export class LogoModule {}
