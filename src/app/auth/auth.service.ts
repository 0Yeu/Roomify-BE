import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { UserService } from '@src/app/user/user.service';
import { JwtService } from '@nestjs/jwt';
import Bcrypt from '@src/plugins/bcrypt.plugin';
import { RegisterDto } from '@src/models/auth/auth-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/entities/user.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LoginDTO } from '@src/models/auth/auth-login.dto';
import { UpdateMyUserDto } from '@src/models/users/update-my-user.dto';
import admin from 'firebase-admin';
import { Check } from '@models/rs_pb';
import { clientService } from '../../../route.serive';

@Injectable()
export class AuthService extends TypeOrmCrudService<User> {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) repository
  ) {
    super(repository);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) throw new NotFoundException('Tên người dùng hoặc mật khẩu không đúng');
    const isPasswordMatching = await Bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new NotFoundException('Tên người dùng hoặc mật khẩu không đúng');
    }
    if (user.status === 'BANNED') throw new ForbiddenException('Tài khoản của bạn đã bị chặn !!!');
    return user;
  }

  async login(user: LoginDTO) {
    const result: User = await this.validateUser(user.username, user.password);
    const payload = { username: result.username, id: result.id };
    const token = this.jwtService.sign(payload);
    if (!result.registrationToken) result.registrationToken = [user.registrationToken];
    else if (!result.registrationToken.includes(user.registrationToken)) {
      result.registrationToken.push(user.registrationToken);
    }
    this.repo.update(result.id, { registrationToken: result.registrationToken });
    return {
      token,
      id: result.id,
      username: result.username,
      fullName: result.fullName,
      email: result.email,
      phone: result.phone,
      avatar: result.avatar,
      status: result.status,
      role: result.roles
    };
  }

  async register(userRegister: RegisterDto): Promise<any> {
    const user = {
      fullName: userRegister.fullName,
      password: userRegister.password,
      phone: userRegister.phone,
      username: userRegister.username
    };
    await this.repo.save({ ...user, roles: [{ id: 4 }] });
    const check = new Check();
    check.setMessage('change');
    clientService.trackChange(check);
    return {
      status: 200,
      message: 'Thành công !!!'
    };
  }

  async updateMyInformation(user: User, userUpdate: UpdateMyUserDto): Promise<User> {
    const data: any = user;
    data.permissions = undefined;
    if (userUpdate.phone !== undefined) {
      data.phone = userUpdate.phone;
    }
    if (userUpdate.fullName !== undefined) {
      data.fullName = userUpdate.fullName;
    }
    if (userUpdate.email !== undefined) {
      data.email = userUpdate.email;
    }
    if (userUpdate.avatar !== undefined) {
      data.avatar = userUpdate.avatar;
    }
    const result = await this.repo.save(data);
    return result;
  }

  // async registerPhone(userRegister: RegisterPhoneDto): Promise<void> {
  //   const user = {
  //     fullName: userRegister.fullName,
  //     password: userRegister.password,
  //     phone: userRegister.phone
  //   };
  //   const result = await this.repo.save({ ...user, roles: [{ id: 4 }] });
  //   console.log('RESULT', result);
  // }

}
