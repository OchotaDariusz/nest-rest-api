import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../../auth/roles/role.enum';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: 'user',
  })
  username: string;

  @Column({
    nullable: false,
    default: '$2b$10$mg7KG9fSZaHbOU0EZzSYk.I20qiYB/AAbSOtb37kODVTXWQVLEmCm',
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: [Role.USER],
    array: true,
  })
  roles: Role[];
}
