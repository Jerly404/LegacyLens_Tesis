import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../core/reports/report.service';
import { ProjectService } from '../../core/projects/project.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { Report, ReportType } from '@codelens/shared';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportService = inject(ReportService);
  projectService = inject(ProjectService);
  notificationService = inject(NotificationService);

  activeType = signal<ReportType>('EXECUTIVE');
  currentReport = signal<Report | null>(null);
  isExporting = signal<boolean>(false);

  ngOnInit() {
    this.loadReport(this.activeType());
  }

  loadReport(type: ReportType) {
    this.activeType.set(type);
    this.reportService.getReport(type).subscribe(rep => {
      this.currentReport.set(rep);
    });
  }

  exportReport(format: 'pdf' | 'markdown' | 'docx' | 'json') {
    this.isExporting.set(true);
    this.reportService.exportReport(this.activeType(), format).subscribe({
      next: ({ filename, blobUrl }) => {
        this.isExporting.set(false);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.click();
        this.notificationService.success('Report Exported', `Downloaded ${filename}`);
      },
      error: () => {
        this.isExporting.set(false);
        this.notificationService.error('Export Failed', 'Could not generate report document.');
      }
    });
  }
}
