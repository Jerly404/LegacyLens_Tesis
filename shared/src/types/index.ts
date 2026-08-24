export type UserRole = 'ADMIN' | 'DEVELOPER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type ProjectStatus = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface LanguageShare {
  name: string;
  percentage: number;
  color: string;
  loc?: number;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  repositoryUrl?: string;
  mainLanguage: string;
  framework: string;
  languages: LanguageShare[];
  fileCount: number;
  linesOfCode: number;
  architecture: string;
  confidence: number;
  status: ProjectStatus;
  progress: number;
  lastAnalyzedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  healthScore: number;
  branch?: string;
}

export interface AnalysisStage {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  description: string;
  progress: number;
}

export interface AnalysisProgress {
  projectId: string;
  progress: number; // 0 to 100
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  currentStage: string;
  stages: AnalysisStage[];
  filesProcessed: number;
  totalFiles: number;
  estimatedRemainingTime: string;
  processingSpeed: string;
  logs: string[];
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  language?: string;
  lines?: number;
  size?: number;
  complexity?: number;
  content?: string;
  dependencies?: string[];
}

export interface ArchitectureEvidence {
  title: string;
  description: string;
  files: string[];
  confidence: number;
}

export interface ArchitectureComponent {
  name: string;
  type: string;
  role: string;
  responsibilities: string[];
  filePatterns: string[];
  layer: string;
}

export interface ArchitectureLayer {
  name: string;
  description: string;
  components: string[];
  dependsOn: string[];
}

export interface ArchitectureAnalysis {
  id: string;
  projectId: string;
  type: 'MVC' | 'Layered' | 'Monolithic' | 'Microservices' | 'Hexagonal' | 'Clean Architecture' | 'Event-driven';
  confidence: number;
  summary: string;
  explanation: string;
  evidence: ArchitectureEvidence[];
  components: ArchitectureComponent[];
  layers: ArchitectureLayer[];
  risks: string[];
}

export type RecommendationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationCategory = 'ARCHITECTURE' | 'SECURITY' | 'PERFORMANCE' | 'MAINTAINABILITY' | 'DOCUMENTATION';

export interface AIRecommendation {
  id: string;
  projectId: string;
  title: string;
  severity: RecommendationSeverity;
  category: RecommendationCategory;
  file: string;
  lineRange?: string;
  explanation: string;
  recommendation: string;
  suggestedCode?: string;
  applied?: boolean;
}

export interface DocumentationSection {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  category: 'Overview' | 'Architecture' | 'API' | 'Database' | 'Modules' | 'Deployment' | 'Security';
  content: string;
  lastUpdated: string;
  generatedByAI: boolean;
}

export type UMLType = 'class' | 'sequence' | 'component' | 'flow';

export interface UMLDiagram {
  id: string;
  projectId: string;
  type: UMLType;
  title: string;
  description: string;
  mermaidCode: string;
}

export interface DependencyGraphNode {
  id: string;
  name: string;
  type: 'controller' | 'service' | 'repository' | 'database' | 'external' | 'util';
  layer: string;
  filesCount?: number;
  color?: string;
}

export interface DependencyGraphLink {
  source: string;
  target: string;
  label?: string;
  callCount?: number;
}

export interface DependencyGraphData {
  nodes: DependencyGraphNode[];
  links: DependencyGraphLink[];
}

export interface SourceCitation {
  file: string;
  startLine: number;
  endLine: number;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
  suggestedNextQuestions?: string[];
}

export interface ChatConversation {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  parameters: string;
  contextWindow: string;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  localEndpoint: string;
  description: string;
  isDefault?: boolean;
}

export type ReportType = 'EXECUTIVE' | 'TECHNICAL' | 'ARCHITECTURE' | 'METRICS' | 'REFACTORING';

export interface ReportSection {
  title: string;
  content: string;
  metrics?: Record<string, any>;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  type: ReportType;
  generatedAt: string;
  summary: string;
  sections: ReportSection[];
}

export interface SystemHealth {
  status: 'ONLINE' | 'PROCESSING' | 'OFFLINE' | 'ERROR';
  activeModel: string;
  gpuName: string;
  vramUsedGB: number;
  vramTotalGB: number;
  gpuUtilization: number;
  gpuTemperature: number;
  currentWorkload: 'Low' | 'Moderate' | 'High';
  ollamaEndpoint: string;
  activeAnalysesCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: Date | string;
}
