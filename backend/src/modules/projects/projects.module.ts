import { Module } from '@nestjs/common';
import { ProjectsService } from './application/services/projects.service';
import { ProjectsController } from './presentation/controllers/projects.controller';
import { PrismaProjectsRepository } from './infrastructure/persistence/prisma-projects.repository';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    {
      provide: 'IProjectsRepository',
      useClass: PrismaProjectsRepository,
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
