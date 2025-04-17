import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find(); // Fetch all products
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } }); // Fetch product by ID
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct); // Save new product
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, product);
    return this.findOne(id); // Return updated product
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.delete(id); // Delete product by ID
  }
}