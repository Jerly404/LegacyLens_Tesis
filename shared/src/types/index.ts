export type UserRole = 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisProgress {
  projectId: string;
  progress: number; // 0 to 100
  status: string;
  currentStep: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: Date;
}
