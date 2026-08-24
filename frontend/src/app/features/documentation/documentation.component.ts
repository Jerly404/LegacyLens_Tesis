import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentationService } from '../../core/documentation/documentation.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { DocumentationSection } from '@codelens/shared';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  docService = inject(DocumentationService);
  notificationService = inject(NotificationService);

  searchQuery = signal<string>('');
  selectedDocId = signal<string>('doc-overview');
  isEditing = signal<boolean>(false);
  editedContent = signal<string>('');
  isRegenerating = signal<boolean>(false);

  filteredDocs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.docService.docs().filter(d => 
      !q || d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );
  });

  activeDoc = computed(() => {
    return this.docService.docs().find(d => d.id === this.selectedDocId()) || this.docService.docs()[0];
  });

  ngOnInit() {
    this.docService.getAll().subscribe(docs => {
      if (docs.length > 0) {
        this.selectedDocId.set(docs[0].id);
        this.editedContent.set(docs[0].content);
      }
    });
  }

  selectDoc(doc: DocumentationSection) {
    this.selectedDocId.set(doc.id);
    this.editedContent.set(doc.content);
    this.isEditing.set(false);
  }

  toggleEdit() {
    if (!this.isEditing()) {
      this.editedContent.set(this.activeDoc().content);
      this.isEditing.set(true);
    } else {
      // Save changes
      this.docService.updateDoc(this.selectedDocId(), this.editedContent());
      this.isEditing.set(false);
      this.notificationService.success('Documentation Updated', `Saved edits to ${this.activeDoc().title}`);
    }
  }

  cancelEdit() {
    this.editedContent.set(this.activeDoc().content);
    this.isEditing.set(false);
  }

  regenerate() {
    this.isRegenerating.set(true);
    this.docService.regenerateDoc(this.selectedDocId()).subscribe(updated => {
      this.isRegenerating.set(false);
      this.editedContent.set(updated.content);
      this.notificationService.success('AI Documentation Re-generated', 'Updated AST-derived technical specifications.');
    });
  }

  copyContent() {
    navigator.clipboard.writeText(this.activeDoc().content);
    this.notificationService.info('Copied', 'Documentation markdown copied to clipboard.');
  }

  exportDoc(format: 'markdown' | 'pdf' | 'docx') {
    const blob = new Blob([this.activeDoc().content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.activeDoc().slug}.${format === 'markdown' ? 'md' : format}`;
    a.click();
    URL.revokeObjectURL(url);
    this.notificationService.success('Export Ready', `Downloaded ${this.activeDoc().title} as ${format.toUpperCase()}`);
  }
}
