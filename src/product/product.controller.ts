import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll(); // Fetch all products
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id); // Fetch product by ID
  }

  @Post()
  async create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productService.create(product); // Create a new product
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() product: Partial<Product>,
  ): Promise<Product> {
    return this.productService.update(id, product); // Update product by ID
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.productService.delete(id); // Delete product by ID
  }
}
