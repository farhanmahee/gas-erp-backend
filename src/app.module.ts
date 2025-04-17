import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Or your database type
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'gas_erp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Automatically load entities
      synchronize: true, // Set to false in production
    }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}