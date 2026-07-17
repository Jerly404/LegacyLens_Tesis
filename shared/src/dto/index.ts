export interface CreateProjectDto {
  name: string;
  description?: string;
  repositoryUrl?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
}

export interface CreateUserDto {
  email: string;
  name: string;
  role: 'ADMIN' | 'DEVELOPER' | 'VIEWER';
}
