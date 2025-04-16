import 'reflect-metadata';
import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully!');
    // Start your application logic here
  })
  .catch((error) => console.error('Database connection failed:', error));
  
