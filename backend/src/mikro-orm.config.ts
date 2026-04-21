import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';

import 'dotenv/config';

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  discovery: {
    warnWhenNoEntities: true,
  },
  extensions: [SeedManager],

  host: process.env.SQL_HOST || 'localhost',
  port: parseInt(process.env.SQL_PORT || '5432'),
  user: process.env.SQL_USER || 'postgres',
  password: process.env.SQL_PASSWORD || 'password',
  dbName: process.env.SQL_DB || 'hirelens_notes',
  driverOptions:
    process.env.NODE_ENV === 'production'
      ? {
          connection: { ssl: true },
        }
      : undefined,

  metadataProvider: TsMorphMetadataProvider,

  debug: process.env.NODE_ENV !== 'production',
  seeder: {
    path: 'src/modules/config/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '**/*.seeder.{ts,js}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
});
