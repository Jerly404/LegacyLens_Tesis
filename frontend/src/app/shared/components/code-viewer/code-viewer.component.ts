import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#151821] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      <!-- File Metadata Header -->
      <div class="px-5 py-3.5 bg-[#11131B] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="material-symbols-outlined text-blue-400 text-lg">code</span>
          <div class="min-w-0">
            <span class="text-sm font-mono font-medium text-white truncate block">{{ filePath() }}</span>
            <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{{ lineCount() }} lines</span>
              <span>•</span>
              <span class="font-bold text-slate-300">{{ language() | uppercase }}</span>
              @if (complexity()) {
                <span>•</span>
                <span class="text-amber-400 font-mono">Cyclomatic: {{ complexity() }}</span>
              }
            </div>
          </div>
        </div>

        <!-- Action Toolbar -->
        <div class="flex items-center gap-1.5">
          <button 
            (click)="copyCode()" 
            class="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">{{ copied() ? 'check' : 'content_copy' }}</span>
            <span>{{ copied() ? 'Copied!' : 'Copy' }}</span>
          </button>

          <button 
            (click)="askAi.emit(code())" 
            class="px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">psychology</span>
            <span>Ask AI</span>
          </button>

          <button 
            (click)="explainCode.emit(code())" 
            class="px-2.5 py-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/20 transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">auto_fix_high</span>
            <span>Explain</span>
          </button>
        </div>
      </div>

      <!-- Dependencies Bar -->
      @if (dependencies().length > 0) {
        <div class="px-5 py-2 bg-[#0F1117] border-b border-white/[0.05] flex items-center gap-2 overflow-x-auto text-xs">
          <span class="text-slate-500 flex items-center gap-1 shrink-0">
            <span class="material-symbols-outlined text-xs">account_tree</span>
            Symbols / Dependencies:
          </span>
          @for (dep of dependencies(); track dep) {
            <span class="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-mono text-[11px] border border-white/5 shrink-0">{{ dep }}</span>
          }
        </div>
      }

      <!-- Code Line Content -->
      <div class="flex-1 overflow-auto bg-[#0d0f15] font-mono text-xs p-4 leading-relaxed select-text">
        <table class="w-full border-collapse">
          <tbody>
            @for (line of formattedLines(); track line.num) {
              <tr class="hover:bg-white/[0.03] transition-colors">
                <td class="w-12 text-right pr-4 select-none text-slate-600 font-mono text-[11px] border-r border-white/[0.05] align-top py-0.5">
                  {{ line.num }}
                </td>
                <td class="pl-4 py-0.5 whitespace-pre font-mono text-slate-200" [innerHTML]="line.html"></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CodeViewerComponent {
  code = input<string>('');
  filePath = input<string>('source-file.java');
  language = input<string>('java');
  complexity = input<number | undefined>(undefined);
  dependencies = input<string[]>([]);

  askAi = output<string>();
  explainCode = output<string>();
  refactorAdvice = output<string>();

  copied = signal<boolean>(false);

  lineCount = () => this.code().split('\n').length;

  formattedLines = () => {
    const rawLines = this.code().split('\n');
    return rawLines.map((line, idx) => ({
      num: idx + 1,
      html: this.highlightSyntax(line)
    }));
  };

  copyCode() {
    navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  private highlightSyntax(line: string): string {
    if (!line) return '&nbsp;';

    let escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments for all languages (//, #, --, *, /*)
    if (
      escaped.trim().startsWith('//') || 
      escaped.trim().startsWith('#') || 
      escaped.trim().startsWith('--') || 
      escaped.trim().startsWith('*') || 
      escaped.trim().startsWith('/*')
    ) {
      return `<span class="code-token-comment">${escaped}</span>`;
    }

    // Annotations & Decorators (@RestController, @shared_task, [Authorize], etc.)
    escaped = escaped.replace(/(@[A-Za-z0-9_]+)/g, '<span class="text-purple-400 font-semibold">$1</span>');
    escaped = escaped.replace(/(\[[A-Za-z0-9_\(\)\s,=]+\])/g, '<span class="text-purple-400 font-semibold">$1</span>');

    // C++ Preprocessor
    escaped = escaped.replace(/(#include\s+&lt;.*?&gt;)/g, '<span class="text-amber-400 font-mono">$1</span>');
    escaped = escaped.replace(/(#include\s+".*?")/g, '<span class="text-amber-400 font-mono">$1</span>');

    // Comprehensive Keywords across Java, C#, Python, C++, COBOL, PHP, Go, SQL, TS
    const keywords = [
      // Common OOP & Systems
      'public', 'private', 'protected', 'class', 'interface', 'enum', 'extends', 'implements',
      'import', 'package', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'throw', 'throws',
      'new', 'this', 'final', 'static', 'void', 'int', 'bool', 'boolean', 'double', 'float', 'string',
      'const', 'let', 'var', 'function', 'async', 'await', 'export', 'default', 'type', 'from', 'null', 'true', 'false',
      // C#
      'using', 'namespace', 'Task', 'readonly', 'override', 'virtual', 'get', 'set',
      // Python
      'def', 'self', 'elif', 'with', 'as', 'raise', 'pass', 'lambda', 'yield', 'None',
      // C++
      'template', 'typename', 'nullptr', 'auto', 'struct', 'sizeof', 'std',
      // Go
      'func', 'chan', 'go', 'defer', 'select', 'fallthrough', 'make',
      // COBOL
      'IDENTIFICATION', 'DIVISION', 'PROGRAM-ID', 'ENVIRONMENT', 'DATA', 'FILE', 'SECTION',
      'WORKING-STORAGE', 'PROCEDURE', 'PERFORM', 'UNTIL', 'READ', 'MOVE', 'ADD', 'TO', 'GOBACK',
      'EXEC', 'SQL', 'END-EXEC', 'PIC', 'VALUE', 'ZERO', 'OPEN', 'CLOSE', 'INPUT', 'OUTPUT',
      // SQL
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'JOIN', 'GROUP', 'BY', 'ORDER', 'HAVING'
    ];
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-rose-400 font-medium">$1</span>');
    });

    // Strings in quotes
    escaped = escaped.replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>');
    escaped = escaped.replace(/('.*?')/g, '<span class="text-emerald-400">$1</span>');

    // Method invocations
    escaped = escaped.replace(/(\.[A-Za-z0-9_]+)(\()/g, '<span class="text-blue-400">$1</span>$2');
    escaped = escaped.replace(/(::[A-Za-z0-9_]+)/g, '<span class="text-cyan-400">$1</span>');

    return escaped;
  }
}
