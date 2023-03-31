import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../interfaces/product.interface';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity implements Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: 'product_name',
  })
  name: string;
}
