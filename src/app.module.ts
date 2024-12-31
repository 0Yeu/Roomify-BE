import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseConnectionService } from './database/database-connection.service';
import { CategoryModule } from './app/category/category.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { ValidatorModule } from './validators/validator.module';
import { PropertyModule } from './app/property/property.module';
import { AmenityModule } from './app/amenity/amenity.module';
import { RoomModule } from './app/room/room.module';
import { DestinationModule } from './app/destination/destination.module';
import { UserPermissionModule } from './app/user-permission/user-permission.module';
import { OwnerRegistrationModule } from './app/owner-registration/owner-registration.module';
import { BaseController } from './base.controller';
import { FavoritePropertyModule } from './app/favorite-property/favorite-property.module';
import { BookingModule } from './app/booking/booking.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { RoommateModule } from './app/roommate/roommate.module';
import { PermissionsModule } from './app/permissions/permissions.module';
import { NotificationModule } from './app/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService
    }),
    ScheduleModule.forRoot(),
    CategoryModule,
    UserModule,
    AuthModule,
    ValidatorModule,
    PropertyModule,
    AmenityModule,
    RoomModule,
    DestinationModule,
    UserPermissionModule,
    OwnerRegistrationModule,
    FavoritePropertyModule,
    BookingModule,
    TransactionModule,
    RoommateModule,
    PermissionsModule,
    NotificationModule
  ],
  controllers: [BaseController]
})
export class AppModule {}
