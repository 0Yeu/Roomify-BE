import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuardProperty extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const {headers} = context.switchToHttp().getRequest();
    console.log('asdadasdasdasdasd \n\n\n',headers);
    if(headers.authorization) return super.canActivate(context);
    return context.switchToHttp().getNext();
  }
}
