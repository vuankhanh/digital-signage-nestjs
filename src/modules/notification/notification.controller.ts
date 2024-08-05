import { Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  notification() {
    this.notificationGateway.emitUpdateFrontend();
    return 'Front-end update notification sent';
  }
}
