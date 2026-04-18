import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  clientUrl: 'postgresql://postgres:password@localhost:5432/hirelens_notes',
    metadataProvider: TsMorphMetadataProvider,

  debug: process.env.NODE_ENV !== 'production',
});