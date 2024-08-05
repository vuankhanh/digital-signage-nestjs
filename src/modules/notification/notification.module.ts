import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';

@Module({
  providers: [NotificationGateway],
  exports: [NotificationGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
