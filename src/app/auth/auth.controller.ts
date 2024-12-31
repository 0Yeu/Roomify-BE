import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { LoginDTO } from '@src/models/auth/auth-login.dto';
import { RegisterDto } from '@src/models/auth/auth-register.dto';
import { UpdateMyUserDto } from '@src/models/users/update-my-user.dto';
import { UserRequestDto } from '@src/models/users/user-request.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const { user } = req;
    user.role = user.roles[0].name;
    user.roles = undefined;
    user.permissions = undefined;
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Request() req: UserRequestDto, @Body() body: UpdateMyUserDto) {
    return this.authService.updateMyInformation(req.user, body);
  }

  // @Post('register-phone')
  // async registerPhone(@Body() body: RegisterPhoneDto) {
  //   return this.authService.registerPhone(body);
  // }

  @Post('reset-password')
  async resetPassword(@Body() { password: string }) {}

}
