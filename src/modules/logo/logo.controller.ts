import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateCreateLogoGuard } from './guards/validate_create_logo.guard';
import { ValidateModifyLogoGuard } from './guards/validate_modify_logo.guard';
import { memoryStorageMulterOptions } from 'src/constants/file.constanst';
import { LogoDto } from './dto/logo.dto';
import { FileProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { FileProcessPipe } from 'src/shared/pipes/file_process.pipe';

import { IMedia } from 'src/shared/interfaces/media.interface';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Request } from 'express';
import { Logo } from './schema/logo.schema';
import { LogoService } from './logo.service';
import { DiskStoragePipe } from 'src/shared/pipes/disk-storage.pipe';
import { ChangeUploadfileNamePipe } from 'src/shared/pipes/change-uploadfile-name.pipe';
import { OptionalFilePipe } from 'src/shared/pipes/optional_file.pipe';
import { NotificationGateway } from '../notification/notification.gateway';

@Controller('logo')
export class LogoController {
  constructor(
    private readonly logoService: LogoService,
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getDetail() {
    return await this.logoService.getDetail({});
  }

  @Post()
  @UseGuards(AuthGuard, ValidateCreateLogoGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor,
    FormatResponseInterceptor
  )
  async create(
    @Req() req: Request,
    @Body() body: LogoDto,
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) logo: IMedia
  ) {
    const relativePath = req['customParams'].relativePath;

    const logoDoc: Logo = new Logo(
      logo.url,
      logo.thumbnailUrl,
      relativePath,
      logo.name,
      body.description,
      body.alternateName,
      'image'
    )
    const createdLogo = await this.logoService.create(logoDoc);
    this.notificationGateway.emitDataChange('logo', 'create', createdLogo);
    return createdLogo;
  }

  @Patch()
  @UseGuards(AuthGuard, ValidateModifyLogoGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FormatResponseInterceptor
  )
  async modify(
    @Req() req: Request,
    @Body() body: LogoDto,
    @UploadedFile(OptionalFilePipe) logo?: IMedia
  ) {
    const relativePath = req['customParams'].relativePath;
    const partialLogoDoc: Partial<Logo> = {};
    if(body.description) {
      partialLogoDoc.description = body.description;
    }

    if(body.alternateName) {
      partialLogoDoc.alternateName = body.alternateName;
    }

    if(logo) {
      partialLogoDoc.url = logo.url;
      partialLogoDoc.thumbnailUrl = logo.thumbnailUrl;
      partialLogoDoc.name = logo.name;
      partialLogoDoc.relativePath = relativePath;
    }

    const updatedLogo = await this.logoService.modify({}, partialLogoDoc);
    this.notificationGateway.emitDataChange('logo', 'modify', updatedLogo);
    return updatedLogo;
  }

  @Delete()
  @UseGuards(AuthGuard, ValidateModifyLogoGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async remove() {
    return await this.logoService.remove({});
  }

}
