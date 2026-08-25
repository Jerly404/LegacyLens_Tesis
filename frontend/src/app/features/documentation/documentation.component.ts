import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocumentationService } from '../../core/documentation/documentation.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { DiagramViewerComponent } from '../../shared/components/diagram-viewer/diagram-viewer.component';
import { DocumentationSection } from '@codelens/shared';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DiagramViewerComponent],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  docService = inject(DocumentationService);
  projectService = inject(ProjectService);
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

  renderedHtml = computed(() => {
    return this.parseMarkdown(this.activeDoc()?.content || '');
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

  parseMarkdown(md: string): string {
    if (!md) return '';
    
    // Convert headers
    let html = md
      .replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-purple-300 mt-6 mb-2 border-b border-white/5 pb-1 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-base font-extrabold text-blue-400 mt-6 mb-3 border-b border-white/10 pb-1.5 flex items-center gap-2"><span class="material-symbols-outlined text-base text-blue-400">bookmark</span>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-2"><span class="material-symbols-outlined text-xl text-emerald-400">menu_book</span>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-slate-300">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[11px]">$1</code>')
      .replace(/^---$/gim, '<hr class="border-white/10 my-6"/>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-purple-500/60 bg-purple-500/10 px-4 py-2 rounded-r-xl text-purple-200 text-xs italic my-3">$1</blockquote>');

    // Code Blocks
    html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gim, (_, lang, code) => {
      const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<div class="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0B0D13]">
        <div class="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>${lang ? lang.toUpperCase() : 'CODE'}</span>
          <span class="text-[10px] text-slate-500 font-mono">AST Syntax Verified</span>
        </div>
        <pre class="p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed"><code>${escaped}</code></pre>
      </div>`;
    });

    // Tables & List items
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    const outputLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<div class="my-4 overflow-x-auto rounded-xl border border-white/10 bg-[#12141C] shadow-lg"><table class="w-full text-left border-collapse text-xs">';
          const cols = line.slice(1, -1).split('|').map(c => c.trim());
          tableHtml += '<thead><tr class="border-b border-white/10 bg-white/5 text-slate-300 font-mono font-bold uppercase text-[11px]">';
          cols.forEach(c => {
            tableHtml += `<th class="py-2.5 px-4">${c}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        } else if (line.includes('---')) {
          continue;
        } else {
          const cols = line.slice(1, -1).split('|').map(c => c.trim());
          tableHtml += '<tr class="border-b border-white/[0.04] hover:bg-white/[0.02] transition">';
          cols.forEach((c, idx) => {
            const isPk = c.includes('PRIMARY KEY') || c.includes('PK');
            const isFk = c.includes('FOREIGN KEY') || c.includes('FK');
            const isUq = c.includes('UNIQUE');
            let badge = c;
            if (isPk) badge = `<span class="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">PRIMARY KEY</span>`;
            else if (isFk) badge = `<span class="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-bold">${c}</span>`;
            else if (isUq) badge = `<span class="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">${c}</span>`;
            tableHtml += `<td class="py-2.5 px-4 ${idx === 0 ? 'font-mono text-slate-200 font-semibold' : 'text-slate-300'}">${badge}</td>`;
          });
          tableHtml += '</tr>';
        }
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table></div>';
          outputLines.push(tableHtml);
          tableHtml = '';
        }
        
        if (line.startsWith('- ')) {
          outputLines.push(`<div class="flex items-start gap-2.5 my-1.5 text-slate-300"><span class="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span><div>${line.substring(2)}</div></div>`);
        } else if (line.length > 0) {
          outputLines.push(`<p class="my-2 leading-relaxed text-slate-300">${line}</p>`);
        }
      }
    }

    if (inTable) {
      tableHtml += '</tbody></table></div>';
      outputLines.push(tableHtml);
    }

    return outputLines.join('\n');
  }
}
