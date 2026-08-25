import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ChatService } from '../../core/chat/chat.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent {
  chatService = inject(ChatService);
  projectService = inject(ProjectService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  promptInput = signal<string>('');

  suggestedQuestions = [
    'How does authentication work in this system?',
    'What architecture does this project use and what are the main layers?',
    'Where is the database connection and transaction handling defined?',
    'What are the most complex modules and high-coupling risks?',
    'What refactoring steps should we prioritize first?'
  ];

  send() {
    const text = this.promptInput().trim();
    if (!text || this.chatService.isGenerating()) return;

    this.promptInput.set('');
    this.chatService.sendMessage(text).subscribe();
  }

  askSuggested(question: string) {
    this.promptInput.set(question);
    this.send();
  }

  newChat() {
    this.chatService.createNewConversation();
    this.notificationService.info('New Conversation', 'Started a new codebase chat thread.');
  }

  openCitation(file: string, startLine: number) {
    this.notificationService.info('Navigating to Code', `Opened ${file} (Line ${startLine})`);
    this.router.navigate(['/project-overview']);
  }
}
