import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Environment } from '../environment';

import { DataSource, DataSourceOptions } from 'typeorm';

import { MuscleGroup } from '../modules/muscle-groups/entities/muscle-group.entity';
import { Exercise } from '../modules/exercises/entities/exercise.entity';
import { TrainingExercise } from '../modules/training/entities/training-exercise.entity';
import { Training } from '../modules/training/entities/training.entity';
import { TrainingProgram } from '../modules/training-program/entities/training-program.entity';
import * as MIGRATIONS from './migrations';
import { TrainingProgramTraining } from '../modules/training-program/entities/training-program-training.entity';

const ENTITIES = [
  Exercise,
  MuscleGroup,
  TrainingExercise,
  Training,
  TrainingProgram,
  TrainingProgramTraining,
];

@Injectable()
export class DatabaseService {
  public dataSource!: DataSource;
  public sqliteConnection!: SQLiteConnection;
  public platform!: string;

  constructor(private env: Environment) {}

  public async initializeDatabase(): Promise<void> {
    return new Promise((resolve) => {
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      this.platform = Capacitor.getPlatform();

      if (this.platform !== 'web') {
        this._initializeDataSource().then(resolve);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          const jeepEl = document.createElement('jeep-sqlite');
          document.body.appendChild(jeepEl);
          customElements
            .whenDefined('jeep-sqlite')
            .then(() => {
              this.sqliteConnection.initWebStore().then(() => {
                this._initializeDataSource().then(resolve);
              });
            })
            .catch((err) => {
              console.log(`Error: ${err}`);
              throw new Error(`Error: ${err}`);
            });
        });
      }
    });
  }

  public getDatabaseConnection(): DataSource | null {
    return this.dataSource;
  }

  private async _initializeDataSource() {
    //check sqlite connections consistency
    await this.sqliteConnection
      .checkConnectionsConsistency()
      .catch((e: Error) => {
        console.log(e);
      });

    const dataSourceConfig: DataSourceOptions = {
      name: 'muscleGroupConnection',
      type: 'capacitor',
      driver: this.sqliteConnection,
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
    if (this.platform === 'web') {
      await this.sqliteConnection.saveToStore(this.env.DATABASE_NAME);
    }
  }
}
