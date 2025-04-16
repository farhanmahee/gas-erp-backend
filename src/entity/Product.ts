import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products') // Name of the table in the database
export class Product {
    @PrimaryGeneratedColumn(), // Auto-incremented primary key for the product, unique identifier
    product_id: number; // Primary key, auto-incremented, unique identifier for the product
    // Column decorator to specify that this property is a column in the database
    @Column({ unique: true }) // Unique constraint to ensure no duplicate product codes
    @Column(), // Column decorator to specify that this property is a column in the database
    // Product code, unique identifier for the product
    product_code: string; // Unique code for the product, e.g., "LPG-001"
    @Column() // Column decorator to specify that this property is a column in the database
    name: string; // Name of the product, e.g., "LPG Cylinder"
    @Column() // Column decorator to specify that this property is a column in the database
    description: string; // Description of the product, e.g., "15kg LPG Cylinder"
    @Column() // Column decorator to specify that this property is a column in the database
    // Category of the product, e.g., "LPG", "CNG"
    @Column('decimal', { precision: 10, scale: 2 }), // Column type is decimal with precision and scale
    // Price of the product, e.g., 1500.00
    @Column() // Column decorator to specify that this property is a column in the database
    // Unit price of the product, e.g., 1500.00
    @Column('decimal', { precision: 10, scale: 2 }), // Column type is decimal with precision and scale
    // Unit price of the product, e.g., 1500.00
    @Column() // Column decorator to specify that this property is a column in the database
    // Unit price of the product, e.g., 1500.00
    unit_price: number; // Unit price of the product, stored as a decimal with precision and scale
    @Column() // Column decorator to specify that this property is a column in the database
    // Quantity of the product in stock, e.g., 100
    @Column('int') // Column type is integer
    quantity: number; // Quantity of the product in stock, e.g., 100
    @Column() // Column decorator to specify that this property is a column in the database
    // Minimum quantity of the product in stock, e.g., 10
    @Column('int') // Column type is integer
    min_quantity: number; // Minimum quantity of the product in stock, e.g., 10
    @Column() // Column decorator to specify that this property is a column in the database
    // Maximum quantity of the product in stock, e.g., 1000
    @Column('int') // Column type is integer
    max_quantity: number; // Maximum quantity of the product in stock, e.g., 1000
    @Column() // Column decorator to specify that this property is a column in the database
    // Reorder level of the product, e.g., 20
    @Column('int') // Column type is integer
    reorder_level: number; // Reorder level of the product, e.g., 20
    @Column() // Column decorator to specify that this property is a column in the database
    // Status of the product, e.g., "active", "inactive"
    @Column({ default: 'active' }) // Default value is "active"
    status: string; // Status of the product, e.g., "active", "inactive"
    @Column() // Column decorator to specify that this property is a column in the database
    // Date when the product was created, e.g., "2023-10-01"
    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' }) // Default value is current timestamp
    created_at: Date; // Date when the product was created, e.g., "2023-10-01"
    @Column() // Column decorator to specify that this property is a column in the database
    // Date when the product was last updated, e.g., "2023-10-01"
    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }) // Default value is current timestamp, updated on each change
    updated_at: Date; // Date when the product was last updated, e.g., "2023-10-01"
    @Column() // Column decorator to specify that this property is a column in the database
    // ID of the supplier of the product, e.g., 1
    @Column('int') // Column type is integer
    supplier_id: number; // ID of the supplier of the product, e.g., 1
    @Column() // Column decorator to specify that this property is a column in the database
    // ID of the warehouse where the product is stored, e.g., 1
    @Column('int') // Column type is integer
    // ID of the warehouse where the product is stored, e.g., 1
}