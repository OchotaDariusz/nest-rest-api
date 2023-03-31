import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    description: 'Product name',
    type: String,
    minimum: 3,
    default: 'product_name',
  })
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
