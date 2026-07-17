import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { EventsGateway } from './common/gateways/events.gateway';
import { MetricsService } from './common/monitoring/metrics.service';
import { HealthController } from './common/monitoring/health.controller';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { UploadModule } from './modules/upload/upload.module';
import { ParserModule } from './modules/parser/parser.module';
import { AnalyzerModule } from './modules/analyzer/analyzer.module';
import { DocumentationModule } from './modules/documentation/documentation.module';
import { ArchitectureModule } from './modules/architecture/architecture.module';
import { UmlModule } from './modules/uml/uml.module';
import { AiModule } from './modules/ai/ai.module';
import { RagModule } from './modules/rag/rag.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    UploadModule,
    ParserModule,
    AnalyzerModule,
    DocumentationModule,
    ArchitectureModule,
    UmlModule,
    AiModule,
    RagModule,
    ReportsModule,
    NotificationsModule,
    SettingsModule,
    AuditModule
  ],
  controllers: [HealthController],
  providers: [EventsGateway, MetricsService],
})
export class AppModule {}
