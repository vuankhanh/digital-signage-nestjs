import { Controller, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

@Controller('notification')
@UseGuards(AuthGuard)
@UseInterceptors(FormatResponseInterceptor)
export class NotificationController {
  constructor(
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Post('/web-content-update')
  @HttpCode(200)
  notiUpdateFrontend() {
    this.notificationGateway.emitUpdateFrontend();
    return 'Web content update notification sent';
  }

  @Post('/service-reload-application')
  @HttpCode(200)
  notifiServiceReloadApplication() {
    this.notificationGateway.emitServiceReloadApplication();
    return 'Service reload application notification sent';
  }
}
