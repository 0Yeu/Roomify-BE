import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from '@src/entities/user-permission.entity';
import { User } from '@src/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserPermissionController } from './user-permission.controller';
import { UserPermissionService } from './user-permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission, User])],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [UserPermissionService]
})
export class UserPermissionModule {}
