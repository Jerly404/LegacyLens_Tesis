import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES)
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes').then(r => r.PROJECTS_ROUTES)
      },
      {
        path: 'upload',
        loadChildren: () => import('./features/upload/upload.routes').then(r => r.UPLOAD_ROUTES)
      },
      {
        path: 'projects/upload',
        loadChildren: () => import('./features/upload/upload.routes').then(r => r.UPLOAD_ROUTES)
      },
      {
        path: 'analysis-progress',
        loadChildren: () => import('./features/analysis-progress/analysis-progress.routes').then(r => r.ANALYSIS_PROGRESS_ROUTES)
      },
      {
        path: 'projects/:id/analysis',
        loadChildren: () => import('./features/analysis-progress/analysis-progress.routes').then(r => r.ANALYSIS_PROGRESS_ROUTES)
      },
      {
        path: 'project-overview',
        loadChildren: () => import('./features/project-overview/project-overview.routes').then(r => r.PROJECT_OVERVIEW_ROUTES)
      },
      {
        path: 'projects/:id',
        loadChildren: () => import('./features/project-overview/project-overview.routes').then(r => r.PROJECT_OVERVIEW_ROUTES)
      },
      {
        path: 'documentation',
        loadChildren: () => import('./features/documentation/documentation.routes').then(r => r.DOCUMENTATION_ROUTES)
      },
      {
        path: 'projects/:id/documentation',
        loadChildren: () => import('./features/documentation/documentation.routes').then(r => r.DOCUMENTATION_ROUTES)
      },
      {
        path: 'architecture',
        loadChildren: () => import('./features/architecture/architecture.routes').then(r => r.ARCHITECTURE_ROUTES)
      },
      {
        path: 'projects/:id/architecture',
        loadChildren: () => import('./features/architecture/architecture.routes').then(r => r.ARCHITECTURE_ROUTES)
      },
      {
        path: 'uml',
        loadChildren: () => import('./features/uml/uml.routes').then(r => r.UML_ROUTES)
      },
      {
        path: 'projects/:id/diagrams',
        loadChildren: () => import('./features/uml/uml.routes').then(r => r.UML_ROUTES)
      },
      {
        path: 'ai-chat',
        loadChildren: () => import('./features/ai-chat/ai-chat.routes').then(r => r.AI_CHAT_ROUTES)
      },
      {
        path: 'projects/:id/chat',
        loadChildren: () => import('./features/ai-chat/ai-chat.routes').then(r => r.AI_CHAT_ROUTES)
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes').then(r => r.REPORTS_ROUTES)
      },
      {
        path: 'projects/:id/reports',
        loadChildren: () => import('./features/reports/reports.routes').then(r => r.REPORTS_ROUTES)
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(r => r.SETTINGS_ROUTES)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./features/login/login.routes').then(r => r.LOGIN_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
