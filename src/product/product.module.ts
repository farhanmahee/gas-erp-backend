import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Register Product entity with TypeORM
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService], // Export service if needed in other modules
})
export class ProductModule {}