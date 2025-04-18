import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); // Enable CORS if needed
  await app.listen(3000);
}
bootstrap();
// npx ts-node -r tsconfig-paths/register src/main.ts
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development
// npx ts-node -r tsconfig-paths/register src/main.ts --env=production
// npx ts-node -r tsconfig-paths/register src/main.ts --env=staging
// npx ts-node -r tsconfig-paths/register src/main.ts --env=testing
// npx ts-node -r tsconfig-paths/register src/main.ts --env=local
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=postgresql
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=mysql
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=mongodb
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=sqlite
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=oracle
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=sqlserver
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=firebird
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=ibm_db2
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=postgresql --ssl=true
// npx ts-node -r tsconfig-paths/register src/main.ts --env=development --db=mysql --ssl=true

