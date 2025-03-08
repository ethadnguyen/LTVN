import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/src/config/env/dev.env` });

import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: [`${process.cwd()}/src/**/*.entity.ts`],
  migrations: [`${process.cwd()}/src/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
