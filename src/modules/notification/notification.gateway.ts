import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // You can emit a welcome message or perform any action when a client connects
    client.emit('notification', 'Welcome to the notification service!');
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log(`Client ${client.id} sent: ${data}`);
    return 'aaaa';
  }

  emitNotification(message: string): void {
    this.server.emit('notification', message);
  }
}
