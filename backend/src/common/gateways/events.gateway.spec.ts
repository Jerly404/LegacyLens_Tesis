import { EventsGateway } from './events.gateway';
import { Server, Socket } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let mockServer: Partial<Server>;
  let mockSocket: Partial<Socket>;

  beforeEach(() => {
    gateway = new EventsGateway();
    mockServer = {
      emit: jest.fn(),
    };
    mockSocket = {
      id: 'socket-client-123',
      join: jest.fn(),
    };
    gateway.server = mockServer as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should broadcast progress update for a project', () => {
    gateway.sendProgressUpdate('proj-123', 'AST_PARSING', 45);
    expect(mockServer.emit).toHaveBeenCalledWith(
      'progress:proj-123',
      expect.objectContaining({
        projectId: 'proj-123',
        step: 'AST_PARSING',
        progress: 45,
      }),
    );
  });

  it('should broadcast notification for a user', () => {
    gateway.sendNotification('user-456', 'Analysis Ready', 'Project analyzed successfully', 'success');
    expect(mockServer.emit).toHaveBeenCalledWith(
      'notification:user-456',
      expect.objectContaining({
        title: 'Analysis Ready',
        message: 'Project analyzed successfully',
        type: 'success',
      }),
    );
  });

  it('should join socket to room on handleSubscribe', () => {
    const result = gateway.handleSubscribe(mockSocket as Socket, 'project-room-1');
    expect(mockSocket.join).toHaveBeenCalledWith('project-room-1');
    expect(result).toEqual({ event: 'subscribed', data: 'project-room-1' });
  });
});
