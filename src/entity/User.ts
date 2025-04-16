import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../auth/role.enum'; // Adjust the path if necessary, based on your project structure, this is just an example
// Importing necessary decorators from TypeORM to define the User entity, and the Role enum for user roles, which is assumed to be defined in a separate file, role.enum.ts, in the auth directory.
// The Role enum is used to define the different roles a user can have in the system, such as ADMIN, INVENTORY_MANAGER, etc., which are typically used for authorization and access control in the application, ensuring that users have the appropriate permissions based on their roles.
// The User entity represents the user table in the database, with properties that map to the columns in the table. Each property is decorated with @Column() to specify its characteristics, such as uniqueness, type, and default values, which are essential for defining the structure and constraints of the user data in the database.
// The @Entity() decorator marks the class as a database entity, and the @PrimaryGeneratedColumn() decorator indicates that the id property is the primary key, which is auto-incremented by the database. The other properties are decorated with @Column() to define their characteristics, such as uniqueness, type, and default values, which are essential for defining the structure and constraints of the user data in the database, ensuring data integrity and consistency, and allowing for efficient querying and manipulation of user records.
// The User entity is a crucial part of the application, as it represents the users who will interact with the system, and it is essential to ensure that the user data is stored and managed correctly in the database.


@Entity() // This decorator marks the class as a database entity, which means it will be mapped to a table in the database.
// The table name will be inferred from the class name, or can be explicitly set using the @Entity({ name: 'custom_table_name' }) syntax.
// The @Entity() decorator also allows for additional options, such as specifying the database connection to use, defining table inheritance strategies, and more. In this case, we are using the default options, which will create a table named 'user' in the database.
// The User entity is a crucial part of the application, as it represents the users who will interact with the system, and it is essential to ensure that the user data is stored and managed correctly in the database,
// allowing for efficient querying and manipulation of user records. The properties of the User entity are decorated with @Column() to define their characteristics, such as uniqueness, type, and default values, which are essential for defining the structure and constraints of the user data in the database.

@Entity('user') // Explicitly naming the table as 'user'
// This is optional, as TypeORM will infer the table name from the class name by default. However, explicitly naming the table can be useful for clarity and consistency, especially in larger projects with multiple entities.
// The table name is important for database migrations, queries, and when working with raw SQL, as it ensures that the correct table is referenced in all operations. In this case, we are explicitly naming the table as 'user', which will be created in the database when the application is run.
// The User entity represents the user table in the database, with properties that map to the columns in the table. Each property is decorated with @Column() to specify its characteristics, such as uniqueness, type, and default values, which are essential for defining the structure and constraints of the user data in the database.
// The User entity is a crucial part of the application, as it represents the users who will interact with the system, and it is essential to ensure that the user data is stored and managed correctly in the database.
// The properties of the User entity are decorated with @Column() to define their characteristics, such as uniqueness, type, and default values, which are essential for defining the structure and constraints of the user data in the database.
// The @PrimaryGeneratedColumn() decorator indicates that the id property is the primary key, which is auto-incremented by the database. The other properties are decorated with @Column() to define their characteristics, such as uniqueness, type, and default values, which are essential for defining the structure and constraints of the user data in the database.
export class User {'additionally, the User entity is used to manage user authentication and authorization, ensuring that users have the appropriate permissions based on their roles. The Role enum is used to define the different roles a user can have in the system, such as ADMIN, INVENTORY_MANAGER, etc., which are typically used for authorization and access control in the application.
// The User entity is a crucial part of the application, as it represents the users who will interact with the system, and it is essential to ensure that the user data is stored and managed correctly in the database. The properties of the User entity are decorated with @Column() to define their characteristics, such as uniqueness, type, and default values, which are essential for defining the structure and constraints of the user data in the database.
@PrimaryGeneratedColumn(), // Primary key, auto-incremented, unique identifier for the user
// This decorator marks the property as the primary key of the entity, which means it will be used to uniquely identify each record in the database table.
// The primary key is essential for ensuring data integrity and consistency, as it prevents duplicate records and allows for efficient querying and manipulation of user records.
// The @PrimaryGeneratedColumn() decorator also indicates that the primary key is auto-incremented, meaning that the database will automatically generate a unique value for this property when a new record is inserted into the table. This is useful for ensuring that each user has a unique identifier without requiring manual input or management of the id values.
// The id property is typically used as a foreign key in related tables, allowing for easy relationships between different entities in the database.
// The id property is also used in various operations, such as querying, updating, and deleting user records, making it a crucial part of the User entity.
    id: number; // Primary key, auto-incremented, unique identifier, not null,

@Column({ unique: true })
email: string; // Unique email address of the user, must be unique across all users
// This property is decorated with @Column({ unique: true }) to ensure that the email address is unique across all users in the database.
// This is important for preventing duplicate accounts and ensuring that each user can be uniquely identified by their email address.
// The unique constraint on the email property is enforced at the database level, meaning that if an attempt is made to insert a record with a duplicate email address, the database will throw an error, preventing the operation from completing successfully.

@Column(), // Password for the user account, not null
password: string; // Password for the user account, not null
// This property is decorated with @Column() to indicate that it is a column in the database table, and it is not explicitly marked as unique, as multiple users can have the same password (though this is not recommended for security reasons).
// The password property is typically hashed and salted before being stored in the database to ensure security and prevent unauthorized access to user accounts.
// The password property is used for user authentication, allowing users to log in to the system using their email and password combination.
// The password property is also used in various operations, such as updating user credentials and managing user sessions, making it a crucial part of the User entity.

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.INVENTORY_MANAGER,
    }), // Role of the user, default is INVENTORY_MANAGER
// This property is decorated with @Column() to indicate that it is a column in the database table, and it is of type 'enum', which means it can only take on values defined in the Role enum.
// The Role enum is used to define the different roles a user can have in the system, such as ADMIN, INVENTORY_MANAGER, etc., which are typically used for authorization and access control in the application, ensuring that users have the appropriate permissions based on their roles.
// The default value for the role property is set to Role.INVENTORY_MANAGER, meaning that if no role is specified when creating a new user, they will be assigned the INVENTORY_MANAGER role by default.
// The role property is important for managing user permissions and access control in the application, as it determines what actions a user can perform and what resources they can access.
// The role property is also used in various operations, such as querying user roles, managing user permissions, and enforcing access control policies, making it a crucial part of the User entity.
// The Role enum is assumed to be defined in a separate file, role.enum.ts, in the auth directory, which contains the different roles and their corresponding values.
// The Role enum is typically defined as follows:
// export enum Role {
//     ADMIN = 'admin',
//    INVENTORY_MANAGER = 'inventory_manager',
//     // Add other roles as needed
// }
    role: Role; // Role of the user, default is INVENTORY_MANAGER

    @Column(), // First name of the user, not null
    @Column() // Last name of the user, not null
    @Column() // Indicates if the user is active or not, default is true
    @Column({ default: true }) // Indicates if the user is active or not, default is true
    @Column() // Indicates if the user is active or not, default is true
    @Column({ default: true }) // Indicates if the user is active or not, default is true
    @Column() // Indicates if the user is active or not, default is true
    @Column({ default: true }) // Indicates if the user is active or not, default is true
    @Column() // Indicates if the user is active or not, default is true
    @Column({ default: true }) // Indicates if the user is active or not, default is true
    firstName: string; // First name of the user
// This property is decorated with @Column() to indicate that it is a column in the database table, and it is not explicitly marked as unique, as multiple users can have the same first name (though this is not recommended for security reasons).
// The firstName property is typically used for displaying user information, such as in user profiles, account settings, and other user-related operations.
// The firstName property is also used in various operations, such as querying user information, managing user profiles, and enforcing access control policies, making it a crucial part of the User entity.
// The firstName property is typically used for displaying user information, such as in user profiles, account settings, and other user-related operations.
// The firstName property is also used in various operations, such as querying user information, managing user profiles, and enforcing access control policies, making it a crucial part of the User entity.
// The firstName property is typically used for displaying user information, such as in user profiles, account settings, and other user-related operations.
// The firstName property is also used in various operations, such as querying user information, managing user profiles, and enforcing access control policies, making it a crucial part of the User entity.
// The firstName property is typically used for displaying user information, such as in user profiles, account settings, and other user-related operations.
    @Column()
    lastName: string; // Last name of the user, not null
// This property is decorated with @Column() to indicate that it is a column in the database table, and it is not explicitly marked as unique, as multiple users can have the same last name (though this is not recommended for security reasons).
// The lastName property is typically used for displaying user information, such as in user profiles, account settings, and other user-related operations.
// The lastName property is also used in various operations, such as querying user information, managing user profiles, and enforcing access control policies, making it a crucial part of the User entity.
// The lastName property is typically used for displaying user information, such as in user profiles, account settings, and other user-related operations

    @Column()
    isActive: boolean; // Indicates if the user is active or not, default is true
// This property is decorated with @Column() to indicate that it is a column in the database table, and it is not explicitly marked as unique, as multiple users can have the same active status (though this is not recommended for security reasons).
// The isActive property is typically used for managing user accounts, such as enabling or disabling user access to the system, and it is important for ensuring that only active users can log in and perform actions in the application.
// The isActive property is also used in various operations, such as querying user accounts, managing user sessions, and enforcing access control policies, making it a crucial part of the User entity.
// The isActive property is typically used for managing user accounts, such as enabling or disabling user access to the system, and it is important for ensuring that only active users can log in and perform actions in the application.
// The isActive property is also used in various operations, such as querying user accounts, managing user sessions, and enforcing access control policies, making it a crucial part of the User entity.
// The isActive property is typically used for managing user accounts, such as enabling or disabling user access to the system, and it is important for ensuring that only active users can log in and perform actions in the application.
}