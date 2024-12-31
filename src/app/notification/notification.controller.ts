import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Modules } from '@src/common/decorators/modules.decorator';
import { ModulesName } from '@src/common/enums/modules.enum';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { Notification } from '@src/entities/notification.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { NotificationService } from './notification.service';

@Crud({
  model: {
    type: Notification
  },
  query: {
  },
  routes: {
    exclude: ['createManyBase', 'createOneBase', 'replaceOneBase']
  }
})
@Modules(ModulesName.NOTIFICATION)
@ApiTags('notifications')
@Controller('notifications')
export class NotificationController implements CrudController<Notification> {
  constructor(public service: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/mine')
  getNotificationOfMe(@Req() req: UserRequestDto, @Query() query: GetMany) {
    console.log('req.user :>> ', req.user);
    return this.service.getNotificationOfMe(req.user.id, query);
  }

  @Get('/test/:registrationToken')
  sendNotification(@Param('registrationToken') registrationToken: string) {
    console.log('registrationToken :>> ', registrationToken);
    // return 1;
    return this.service.sendTestToDevice(registrationToken);
  }

  get base(): CrudController<Notification> {
    return this;
  }
}
