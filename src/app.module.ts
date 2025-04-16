import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config'; // Assuming you have a typeOrmConfig file for database configuration
import { ProductModule } from './product/product.module'; // Assuming you have a ProductModule for product-related features
import { AuthModule } from './auth/auth.module'; // Assuming you have an AuthModule for authentication features
// Import necessary modules and configurations
import { AppController } from './app.controller'; // Assuming you have an AppController for handling requests
// Import necessary services and modules
import { AppService } from './app.service'; // Assuming you have an AppService for handling business logic
// Import necessary modules and configurations

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // Initialize TypeORM with the configuration
    // Import your modules here
    ProductModule, // Import the ProductModule for product-related features
    // Import the AuthModule for authentication features
    AuthModule, // Import the AuthModule for authentication features
    // Add other modules as needed, e.g., UserModule, OrderModule, etc.
    // UserModule, // Import the UserModule for user-related features
    // OrderModule, // Import the OrderModule for order-related features
    // Add other modules as needed
    // e.g., CartModule, PaymentModule, etc.
    // CartModule, // Import the CartModule for cart-related features
    // PaymentModule, // Import the PaymentModule for payment-related features
    // Add other modules as needed, e.g., ReviewModule, WishlistModule, etc.
    // ReviewModule, // Import the ReviewModule for product reviews
    // WishlistModule, // Import the WishlistModule for user wishlists
    // Add other modules as needed, e.g., NotificationModule, etc.
    // NotificationModule, // Import the NotificationModule for user notifications
    // Add other modules as needed, e.g., AnalyticsModule, etc.
    // AnalyticsModule, // Import the AnalyticsModule for product analytics
    // Add other modules as needed, e.g., ShippingModule, etc.
    // ShippingModule, // Import the ShippingModule for shipping-related features
    // Add other modules as needed, e.g., ReviewModule, etc.
    // ReviewModule, // Import the ReviewModule for product reviews
    // WishlistModule, // Import the WishlistModule for user wishlists
    // Add other modules as needed, e.g., NotificationModule, etc.
    // NotificationModule, // Import the NotificationModule for user notifications
    // Add other modules as needed, e.g., AnalyticsModule, etc.
    // AnalyticsModule, // Import the AnalyticsModule for product analytics
    // Add other modules as needed, e.g., ShippingModule, etc.
    // ShippingModule, // Import the ShippingModule for shipping-related features
    // Add other modules as needed, e.g., ReviewModule, etc.
    // ReviewModule, // Import the ReviewModule for product reviews
    // WishlistModule, // Import the WishlistModule for user wishlists
    // Add other modules as needed, e.g., NotificationModule, etc.
    // NotificationModule, // Import the NotificationModule for user notifications
    // Add other modules as needed, e.g., AnalyticsModule, etc.
    // AnalyticsModule, // Import the AnalyticsModule for product analytics
    // Add other modules as needed, e.g., ShippingModule, etc.
    // ShippingModule, // Import the ShippingModule for shipping-related features
    // Add other modules as needed, e.g., ReviewModule, etc.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}