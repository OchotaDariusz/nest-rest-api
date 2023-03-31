import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@ApiSecurity('bearer')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() user: UserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  async login(@Body() user: UserDto) {
    return this.authService.login(user);
  }

  @Get('/current')
  @Roles(Role.ADMIN, Role.USER)
  getCurrentUser(@Request() req) {
    return req.user;
  }
}
