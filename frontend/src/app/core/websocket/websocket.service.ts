import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any = null;
  private progressUpdates = new Subject<any>();

  progress$ = this.progressUpdates.asObservable();
  isConnected = signal<boolean>(false);

  connect() {
    this.isConnected.set(true);
    console.log('Websocket connected to: /ws');
  }

  subscribeToProject(projectId: string) {
    console.log(`Subscribed to progress room: progress:${projectId}`);
    // Simulated updates
    let count = 0;
    const interval = setInterval(() => {
      count += 10;
      this.progressUpdates.next({
        projectId,
        step: count < 40 ? 'Parsing AST' : count < 80 ? 'Running LLM Analysis' : 'Generating UML Diagrams',
        progress: count
      });
      if (count >= 100) {
        clearInterval(interval);
      }
    }, 2000);
  }
}
