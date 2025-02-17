import { DataSource, type DataSourceOptions } from 'typeorm';
import sqliteParams from 'src/app/sqliteParams';
import * as entities from './entities/muscle-group';
// import * as migrations from '../migrations/author';
import { CEnvironment } from 'src/app/environment';

const dataSourceConfig: DataSourceOptions = {
  name: 'muscleGroupConnection',
  type: 'capacitor',
  driver: sqliteParams.connection,
  database: CEnvironment.DATABASE_NAME,
  mode: 'no-encryption',
  entities: entities,
  // migrations: migrations, //["../migrations/author/*{.ts,.js}"]
  subscribers: [],
  logging: [/*'query',*/ 'error', 'schema'],
  synchronize: false, // !!!You will lose all data in database if set to `true`
  migrationsRun: false, // Required with capacitor type
};
export const dataSourceMuscleGroup = new DataSource(dataSourceConfig);
const muscleGroupDataSource = {
  dataSource: dataSourceMuscleGroup,
  dbName: CEnvironment.DATABASE_NAME,
};

export default muscleGroupDataSource;
