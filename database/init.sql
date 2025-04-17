-- Drop database if exists
DROP DATABASE IF EXISTS `gas_erp`;

-- Create database
CREATE DATABASE `gas_erp` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `gas_erp`;

-- Create Users table
CREATE TABLE `user` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM(
        'SUPER_ADMIN',
        'INVENTORY_MANAGER',
        'SALES_MANAGER', 
        'ACCOUNTING_MANAGER',
        'CUSTOMER_SERVICE',
        'MARKETING_MANAGER',
        'SYSTEM_ADMIN',
        'WAREHOUSE_MANAGER',
        'SALES_REP',
        'ACCOUNTING_CLERK',
        'CUSTOMER_SERVICE_REP',
        'MARKETING_ASSOCIATE',
        'SYSTEM_ANALYST',
        'WAREHOUSE_ASSOCIATE'
    ) NOT NULL DEFAULT 'INVENTORY_MANAGER',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Products table
CREATE TABLE `product` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `warehouse_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);