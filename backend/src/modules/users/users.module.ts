import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UsersController } from './presentation/controllers/users.controller';
import { PrismaUsersRepository } from './infrastructure/persistence/prisma-users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUsersRepository',
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
