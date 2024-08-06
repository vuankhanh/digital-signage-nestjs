import { Controller, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Post('/web-content-update')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UseInterceptors(FormatResponseInterceptor)
  notification() {
    this.notificationGateway.emitUpdateFrontend();
    return 'Web content update notification sent';
  }
}
