import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monaco-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner">
      <div class="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ filename() }}</span>
        <span class="text-xs bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full font-mono">{{ language() }}</span>
      </div>
      <textarea 
        [ngModel]="code()" 
        (ngModelChange)="onCodeChange($event)"
        class="w-full h-80 p-4 font-mono text-sm bg-slate-950 text-slate-200 outline-none resize-y"
        spellcheck="false"
      ></textarea>
    </div>
  `
})
export class EditorComponent {
  code = input<string>('');
  filename = input<string>('index.ts');
  language = input<string>('typescript');
  codeChanged = output<string>();

  onCodeChange(newVal: string) {
    this.codeChanged.emit(newVal);
  }
}
