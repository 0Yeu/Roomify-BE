/**
 * TypeORM config file to configure the path to seeds and factories
 */
module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  seeds: ['src/database/seeds/**/*.seed{.ts,.js}'],
  factories: ['src/database/factories/**/*.factory{.ts,.js}'],
  migrations: [
    'src/database/migrations/*.ts'
  ],
  cli: {
    migrationsDir: 'src/database/migrations'
  }
};
