import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.getUserByUsername(username);
    if (user && bcrypt.compare(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userDetails } = user;
      return userDetails;
    }
    return null;
  }

  async register(user: User): Promise<any> {
    return await this.usersService.addNewUser(user);
  }

  async login(userCredentials: User): Promise<any> {
    const user = await this.usersService.getUserByUsername(
      userCredentials.username,
    );
    if (user) {
      const payload = {
        username: user.username,
        sub: user.id,
        roles: user.roles,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return {
      access_token: null,
    };
  }
}
