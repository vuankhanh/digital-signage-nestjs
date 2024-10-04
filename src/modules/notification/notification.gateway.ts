import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // You can emit a welcome message or perform any action when a client connects
    client.emit('notification', 'Welcome to the notification service!');
  }

  //Đây là gì?
  // Ở Postman cần phải làm gì để test được hàm này?

  @SubscribeMessage('message')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log(`Client ${client.id} sent: ${data}`);
    return 'aaaa';
  }

  emitDataChange(route: 'logo' | 'album' | 'hightlightMarketing', action: 'create' | 'modify' , data: any): void {
    const message = {
      route,
      action,
      data,
    };
    this.server.emit('data_change', message);
  }

  emitUpdateFrontend(): void {
    this.server.emit('update_frontend');
  }

  emitServiceReloadApplication(): void {
    this.server.emit('reload_marketing4than.service');
  }
}
