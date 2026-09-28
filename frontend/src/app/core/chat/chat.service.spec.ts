import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    const mockFetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          response: 'Authentication is handled in src/controllers/AuthController.java:24.'
        })
      })
    );
    (globalThis as any).fetch = mockFetch;
    (window as any).fetch = mockFetch;

    TestBed.configureTestingModule({
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
  });

  it('should initialize with active conversation threads', () => {
    expect(service.conversations().length).toBeGreaterThan(0);
    expect(service.activeConversation()).toBeDefined();
  });

  it('should create new conversation', () => {
    const prevCount = service.conversations().length;
    const newId = service.createNewConversation('proj-banking-core');
    expect(newId).toBeDefined();
    expect(service.conversations().length).toBe(prevCount + 1);
    expect(service.activeConversation().id).toBe(newId);
  });

  it('should send user message and generate AI response with citations', (done) => {
    service.sendMessage('How does authentication work?').subscribe(response => {
      expect(response).toBeDefined();
      expect(response.sender).toBe('assistant');
      expect(response.sources).toBeDefined();
      expect(response.sources?.length).toBeGreaterThan(0);
      done();
    });
  });
});
