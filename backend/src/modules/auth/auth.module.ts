import { Module } from '@nestjs/common';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { PrismaAuthRepository } from './infrastructure/persistence/prisma-auth.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthRepository',
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
