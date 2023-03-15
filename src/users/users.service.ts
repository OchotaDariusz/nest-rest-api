import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException("Can't find that user.");
    }
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("Can't find that user.");
    }
    return user;
  }

  async addNewUser(user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = { ...user, password: hashedPassword };
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: string, updateDetails: User): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("Can't find user to update.");
    }
    user.username = updateDetails.username;
    user.password = updateDetails.password;
    return await this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("Can't find user to delete.");
    }
    await this.userRepository.delete(id);
  }
}
