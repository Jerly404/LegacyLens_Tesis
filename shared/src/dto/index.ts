import { ProjectStatus, UserRole, ReportType } from '../types';

export interface CreateProjectDto {
  name: string;
  description?: string;
  repositoryUrl?: string;
  sourceType?: 'zip' | 'git' | 'folder';
  mainLanguage?: string;
  framework?: string;
  branch?: string;
  analysisDepth?: 'quick' | 'standard' | 'deep';
  modelId?: string;
  contextWindow?: string;
  docLevel?: 'minimal' | 'standard' | 'enterprise';
  detectArchitecture?: boolean;
  analyzeDependencies?: boolean;
  generateUml?: boolean;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  progress?: number;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface StartAnalysisDto {
  projectId: string;
  model: string;
  depth: 'quick' | 'standard' | 'deep';
  includeUml: boolean;
  includeDocs: boolean;
  includeDependencies: boolean;
}

export interface SendChatMessageDto {
  conversationId?: string;
  projectId: string;
  prompt: string;
}

export interface UpdateSettingsDto {
  activeModelId?: string;
  localAiEndpoint?: string;
  theme?: 'dark' | 'light' | 'system';
  language?: 'en' | 'es';
  autoSaveDocs?: boolean;
  notificationsEnabled?: boolean;
}

export interface GenerateReportDto {
  projectId: string;
  type: ReportType;
  customNotes?: string;
}
