import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from "./data-source";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
        bootstrap();
    })
    .catch((error) => console.error("Database connection failed:", error));
