import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { Role } from '../auth/roles/role.enum';
import { Roles } from '../auth/roles/roles.decorator';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@ApiSecurity('bearer')
@Controller('/api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  getAllItems() {
    return this.productsService.getAllProducts();
  }

  @Get('/:uuid')
  @Roles(Role.ADMIN, Role.USER)
  getItem(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.productsService.getProductById(uuid);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  postNewItem(@Body() product: ProductDto) {
    return this.productsService.addNewProduct(product);
  }

  @Patch('/:uuid')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  patchItem(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() product: ProductDto,
  ) {
    return this.productsService.updateProduct(uuid, product);
  }

  @Delete('/:uuid')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(204)
  deleteItem(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.productsService.deleteProduct(uuid);
  }
}
