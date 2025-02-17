import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Environment } from '../environment';

import { DataSource, DataSourceOptions } from 'typeorm';

import { MuscleGroup } from '../modules/muscle-groups/entities/muscle-group.entity';
import { Exercise } from '../modules/exercises/entities/exercise.entity';

import * as MIGRATIONS from './migrations';

const ENTITIES = [Exercise, MuscleGroup];

@Injectable()
export class DatabaseService {
  public dataSource!: DataSource;
  private _sqliteConnection!: SQLiteConnection;
  private _platform!: string;

  constructor(private env: Environment) {}

  public async initializeDatabase(): Promise<void> {
    this._sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    this._platform = Capacitor.getPlatform();

    if (this._platform !== 'web') {
      await this._initializeDataSource();
    } else {
      window.addEventListener('DOMContentLoaded', async () => {
        const jeepEl = document.createElement('jeep-sqlite');
        document.body.appendChild(jeepEl);
        customElements
          .whenDefined('jeep-sqlite')
          .then(async () => {
            await this._sqliteConnection.initWebStore();
            await this._initializeDataSource();
          })
          .catch((err) => {
            console.log(`Error: ${err}`);
            throw new Error(`Error: ${err}`);
          });
      });
    }
  }

  public getDatabaseConnection(): DataSource | null {
    return this.dataSource;
  }

  private async _initializeDataSource() {
    //check sqlite connections consistency
    await this._sqliteConnection
      .checkConnectionsConsistency()
      .catch((e: Error) => {
        console.log(e);
      });

    const dataSourceConfig: DataSourceOptions = {
      name: 'muscleGroupConnection',
      type: 'capacitor',
      driver: this._sqliteConnection,
      database: this.env.DATABASE_NAME,
      mode: 'no-encryption',
      entities: ENTITIES,
      migrations: MIGRATIONS, //["../migrations/author/*{.ts,.js}"]
      subscribers: [],
      logging: [/*'query',*/ 'error', 'schema'],
      synchronize: false, // !!!You will lose all data in database if set to `true`
      migrationsRun: false, // Required with capacitor type
    };

    this.dataSource = new DataSource(dataSourceConfig);

    await this.dataSource.initialize();
    if (this.dataSource.isInitialized) {
      await this.dataSource.runMigrations();
    }
    if (this._platform === 'web') {
      await this._sqliteConnection.saveToStore(this.env.DATABASE_NAME);
    }
  }
}
