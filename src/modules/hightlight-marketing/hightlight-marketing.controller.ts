import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateCreateHightlightMarketingGuard } from './guards/validate_create_hightlight-marketing.guard';
import { ValidateModifyHightlightMarketingGuard } from './guards/validate_modify_hightlight-marketing.guard';
import { memoryStorageMulterOptions } from 'src/constants/file.constanst';
import { HightlightDto } from './dto/hightlight-marketing.dto';
import { FileProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { FileProcessPipe } from 'src/shared/pipes/file_process.pipe';

import { IMedia } from 'src/shared/interfaces/media.interface';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Request } from 'express';
import { HightlightMarketing } from './schema/hightlight-marketing.schema';
import { HightlightMarketingService } from './hightlight-marketing.service';
import { DiskStoragePipe } from 'src/shared/pipes/disk-storage.pipe';
import { ChangeUploadfileNamePipe } from 'src/shared/pipes/change-uploadfile-name.pipe';
import { OptionalFilePipe } from 'src/shared/pipes/optional_file.pipe';

@Controller('hightlight-marketing')
export class HightlightMarketingController {
  constructor(
    private readonly hightlightMarketingService: HightlightMarketingService,
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getDetail() {
    return await this.hightlightMarketingService.getDetail({});
  }

  @Post()
  @UseGuards(AuthGuard, ValidateCreateHightlightMarketingGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor,
    FormatResponseInterceptor
  )
  async create(
    @Req() req: Request,
    @Body() body: HightlightDto,
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) hightlightMarketing: IMedia
  ) {
    const relativePath = req['customParams'].relativePath;

    const albumDoc: HightlightMarketing = new HightlightMarketing(
      hightlightMarketing.url,
      hightlightMarketing.thumbnailUrl,
      relativePath,
      hightlightMarketing.name,
      body.description,
      body.alternateName,
      'image'
    )
    return await this.hightlightMarketingService.create(albumDoc);
  }

  @Patch()
  @UseGuards(AuthGuard, ValidateModifyHightlightMarketingGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FormatResponseInterceptor
  )
  async modify(
    @Req() req: Request,
    @Body() body: HightlightDto,
    @UploadedFile(OptionalFilePipe) hightlightMarketing?: IMedia
  ) {
    const relativePath = req['customParams'].relativePath;
    const partialHightlightMarketingDoc: Partial<HightlightMarketing> = {};
    if(body.description) {
      partialHightlightMarketingDoc.description = body.description;
    }

    if(body.alternateName) {
      partialHightlightMarketingDoc.alternateName = body.alternateName;
    }

    if(hightlightMarketing) {
      partialHightlightMarketingDoc.url = hightlightMarketing.url;
      partialHightlightMarketingDoc.thumbnailUrl = hightlightMarketing.thumbnailUrl;
      partialHightlightMarketingDoc.name = hightlightMarketing.name;
      partialHightlightMarketingDoc.relativePath = relativePath;
    }

    return await this.hightlightMarketingService.modify({}, partialHightlightMarketingDoc);
  }

  @Delete()
  @UseGuards(AuthGuard, ValidateModifyHightlightMarketingGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async remove() {
    return await this.hightlightMarketingService.remove({});
  }

}
