import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ApiClientService } from '../../core/http/api-client.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { DiagramComponent } from '../../shared/components/diagram/diagram.component';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, EditorComponent, ChartComponent, DiagramComponent],
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.css']
})
export class ArchitectureComponent {
  private authService = inject(AuthService);
  private apiClient = inject(ApiClientService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  loading = signal(false);

  // Mock Feature Data
  title = 'Architecture';
  codeSample = signal('// CodeLens AI analysis workspace\nfunction analyzeCodebase(repo: string) {\n  console.log("Analyzing " + repo);\n}');
  diagramDef = signal('graph TD\n  A[Source Code] --> B(AST Parser)\n  B --> C{{Tree Sitter}}\n  C --> D[UML Generator]\n  C --> E[RAG Vector Store]');

  login() {
    this.loading.set(true);
    this.authService.login(this.email()).subscribe(() => {
      this.loading.set(false);
    });
  }
}
