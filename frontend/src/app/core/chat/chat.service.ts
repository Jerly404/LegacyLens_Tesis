import { Injectable, signal } from '@angular/core';
import { ChatConversation, ChatMessage, SourceCitation } from '@codelens/shared';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private initialConversations: ChatConversation[] = [
    {
      id: 'conv-1',
      projectId: 'proj-banking-core',
      title: 'Authentication & Password Flow',
      createdAt: '2026-08-24 14:10',
      updatedAt: '2026-08-24 14:15',
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          content: 'How does authentication work in this legacy codebase?',
          timestamp: '14:10'
        },
        {
          id: 'msg-2',
          sender: 'assistant',
          content: `Authentication is orchestrated by **\`AuthController\`** delegating directly to **\`AuthService\`** and verified via custom Spring Security filters:

1. The client sends user credentials to \`POST /api/v1/auth/login\`.
2. \`AuthService.validateCredentials\` executes an SQL lookup on the \`USERS\` table via \`UserRepository\`.
3. The password hash is verified with a legacy SHA-1 algorithm (\`legacyPasswordVerify\`).
4. Once verified, \`JwtTokenUtil\` issues an HMAC-SHA256 bearer token with embedded user roles.

### Security Warning:
The password verification routine relies on unsalted or static-salted SHA-1, which does not meet modern cryptographic standards (NIST SP 800-63B). Upgrading to BCrypt or Argon2id is highly recommended.`,
          timestamp: '14:11',
          sources: [
            { file: 'src/controllers/AuthController.java', startLine: 24, endLine: 35, snippet: 'boolean isValid = authService.validateCredentials(request.getUsername(), request.getPassword());' },
            { file: 'src/services/AuthService.java', startLine: 18, endLine: 32, snippet: 'return legacyPasswordVerify(rawPassword, user.getPasswordHash());' }
          ],
          suggestedNextQuestions: [
            'How can I refactor AuthService to use BCryptPasswordEncoder?',
            'Where are user roles and permissions persisted?',
            'How does token refresh work?'
          ]
        }
      ]
    },
    {
      id: 'conv-2',
      projectId: 'proj-banking-core',
      title: 'Database Transactions & Locks',
      createdAt: '2026-08-24 15:00',
      updatedAt: '2026-08-24 15:05',
      messages: [
        {
          id: 'msg-3',
          sender: 'user',
          content: 'Where is the database connection defined and how are transactions handled?',
          timestamp: '15:00'
        },
        {
          id: 'msg-4',
          sender: 'assistant',
          content: `The database configuration and transaction strategy are structured as follows:

- **Connection Pool**: Configured in \`config/application.properties\` targeting Oracle 19c RAC via JDBC (\`jdbc:oracle:thin:@//oracle-db.internal:1521/FINCORE\`).
- **Transaction Isolation**: \`TransactionService.processTransfer\` uses \`@Transactional(isolation = Isolation.SERIALIZABLE, rollbackFor = Exception.class)\`.
- **Concurrency Locking**: Pessimistic database row locks are acquired via \`SELECT ... FOR UPDATE\` queries on the \`ACCOUNTS\` table to prevent double-spending during concurrent transfer requests.`,
          timestamp: '15:01',
          sources: [
            { file: 'config/application.properties', startLine: 1, endLine: 5, snippet: 'spring.datasource.url=jdbc:oracle:thin:@//oracle-db.internal:1521/FINCORE' },
            { file: 'src/services/TransactionService.java', startLine: 22, endLine: 36, snippet: '@Transactional(isolation = Isolation.SERIALIZABLE, rollbackFor = Exception.class)' }
          ],
          suggestedNextQuestions: [
            'Does SERIALIZABLE isolation cause database deadlocks?',
            'What tables are touched during a transfer?',
            'How is the IBM MQ event dispatched?'
          ]
        }
      ]
    }
  ];

  private conversationsSignal = signal<ChatConversation[]>(this.initialConversations);
  private activeConversationId = signal<string>('conv-1');
  private isGeneratingSignal = signal<boolean>(false);

  conversations = this.conversationsSignal.asReadonly();
  activeConversation = () => this.conversationsSignal().find(c => c.id === this.activeConversationId()) || this.conversationsSignal()[0];
  isGenerating = this.isGeneratingSignal.asReadonly();

  selectConversation(id: string) {
    this.activeConversationId.set(id);
  }

  createNewConversation(projectId = 'proj-banking-core'): string {
    const newId = 'conv-' + Date.now().toString(36);
    const newConv: ChatConversation = {
      id: newId,
      projectId,
      title: 'New Codebase Inquiry',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: []
    };

    this.conversationsSignal.update(list => [newConv, ...list]);
    this.activeConversationId.set(newId);
    return newId;
  }

  deleteConversation(id: string) {
    this.conversationsSignal.update(list => list.filter(c => c.id !== id));
    if (this.activeConversationId() === id && this.conversationsSignal().length > 0) {
      this.activeConversationId.set(this.conversationsSignal()[0].id);
    }
  }

  sendMessage(userPrompt: string): Observable<ChatMessage> {
    const activeId = this.activeConversationId();
    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message
    this.conversationsSignal.update(list => list.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          title: c.messages.length === 0 ? userPrompt.slice(0, 30) + '...' : c.title,
          messages: [...c.messages, userMsg],
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return c;
    }));

    this.isGeneratingSignal.set(true);

    // Generate smart context-aware response based on the prompt
    return new Observable<ChatMessage>(subscriber => {
      setTimeout(() => {
        const aiResponse = this.generateAIResponse(userPrompt);
        
        this.conversationsSignal.update(list => list.map(c => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: [...c.messages, aiResponse],
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return c;
        }));

        this.isGeneratingSignal.set(false);
        subscriber.next(aiResponse);
        subscriber.complete();
      }, 1200);
    });
  }

  private generateAIResponse(prompt: string): ChatMessage {
    const lower = prompt.toLowerCase();
    let content = '';
    let sources: SourceCitation[] = [];
    let suggestions: string[] = [];

    if (lower.includes('auth') || lower.includes('password') || lower.includes('login') || lower.includes('token')) {
      content = `### Authentication Architecture Analysis
Authentication is handled primarily by **\`AuthController.java\`** and **\`AuthService.java\`**:

1. **Credentials Validation**: Validates against the \`USERS\` database table.
2. **Session Token**: Issues HMAC JWT tokens via \`JwtTokenUtil.java\`.
3. **Security Finding**: Uses a legacy SHA-1 hash without salt rotation. We recommend refactoring this to BCrypt (work factor 12).`;
      sources = [
        { file: 'src/controllers/AuthController.java', startLine: 18, endLine: 36, snippet: 'public ResponseEntity<AuthResponse> authenticate(@RequestBody LoginRequest request)' },
        { file: 'src/services/AuthService.java', startLine: 15, endLine: 35, snippet: 'boolean isValid = legacyPasswordVerify(rawPassword, user.getPasswordHash());' }
      ];
      suggestions = [
        'How can we migrate existing user passwords safely to BCrypt?',
        'Where are JWT claims parsed in subsequent requests?',
        'What endpoints are protected by security filters?'
      ];
    } else if (lower.includes('architecture') || lower.includes('layer') || lower.includes('pattern')) {
      content = `### Architectural Detection Overview
This codebase conforms to an **N-Tier Layered Architecture (94% confidence)**:

- **Presentation Layer**: 18 Spring REST Controllers in \`src/controllers\`
- **Service Layer**: 26 Business Services in \`src/services\`
- **Data Persistence**: 34 JPA Repositories in \`src/repositories\`
- **Database**: Oracle 19c RAC with custom PL/SQL stored procedures

**Identified Architectural Debt**:
The \`TransactionService\` contains direct JDBC calls to stored procedures, bypassing repository abstractions.`;
      sources = [
        { file: 'src/controllers/TransactionController.java', startLine: 1, endLine: 40 },
        { file: 'src/services/TransactionService.java', startLine: 1, endLine: 60 },
        { file: 'src/repositories/AccountRepository.java', startLine: 1, endLine: 30 }
      ];
      suggestions = [
        'How can we decouple TransactionService from PL/SQL?',
        'What would a Clean Architecture migration look like for this module?',
        'Which components have the highest cyclomatic complexity?'
      ];
    } else if (lower.includes('database') || lower.includes('sql') || lower.includes('table') || lower.includes('db')) {
      content = `### Database Tier & Connectivity
The database layer connects to Oracle 19c Enterprise:

- **Datasource**: Configured in \`config/application.properties\` (\`spring.datasource.url=jdbc:oracle:thin:@//oracle-db.internal:1521/FINCORE\`).
- **Core Entities**: \`UserEntity\` maps to table \`USERS\`, \`Account\` maps to \`ACCOUNTS\`.
- **Transactions**: Configured with \`@Transactional(isolation = Isolation.SERIALIZABLE)\`.`;
      sources = [
        { file: 'config/application.properties', startLine: 1, endLine: 6 },
        { file: 'src/repositories/AccountRepository.java', startLine: 10, endLine: 28 }
      ];
      suggestions = [
        'What indexes exist on the ACCOUNTS table?',
        'Are there connection pool leaks under load?',
        'How does optimistic locking compare to the current pessimistic lock?'
      ];
    } else {
      content = `### LegacyAI Codebase Intelligence
Based on deep semantic indexing of your repository (\`1,842 files\`, \`245,800 LOC\`):

- **Query match**: "${prompt}"
- **Identified Modules**: Found relevant implementations across \`src/services\` and \`src/controllers\`.
- **Summary**: The transaction and service subsystems coordinate core business operations while delegating database access to JPA repositories and native stored procedures.`;
      sources = [
        { file: 'src/services/TransactionService.java', startLine: 15, endLine: 45 },
        { file: 'src/controllers/AuthController.java', startLine: 20, endLine: 38 }
      ];
      suggestions = [
        'Show me the full dependency graph for this component',
        'Generate technical documentation for this module',
        'What are the high-priority refactoring recommendations?'
      ];
    }

    return {
      id: 'msg-a-' + Date.now(),
      sender: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources,
      suggestedNextQuestions: suggestions
    };
  }
}
