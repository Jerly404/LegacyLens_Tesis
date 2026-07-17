import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'ws',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('EventsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendProgressUpdate(projectId: string, step: string, progress: number) {
    this.server.emit(`progress:${projectId}`, {
      projectId,
      step,
      progress,
      timestamp: new Date().toISOString(),
    });
  }

  sendNotification(userId: string, title: string, message: string, type: string) {
    this.server.emit(`notification:${userId}`, {
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to room ${room}`);
    return { event: 'subscribed', data: room };
  }
}
