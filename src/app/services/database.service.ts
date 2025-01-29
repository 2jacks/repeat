import { Injectable } from '@angular/core';
import * as Loki from 'lokijs';
import { Environment } from 'src/app/environment';
import { INITIAL_COLLECTIONS_DATA } from '../assets/initial-collections-data';
import { Signal } from '../utils/decorators/Signal';

type TPersistenceMethod = 'localStorage' | 'fs' | 'memory' | null | undefined;

const PERSISTENCE_METHOD: TPersistenceMethod = 'localStorage';

@Injectable()
export class DatabaseService {
  @(Signal<boolean>)
  public isInitialized: boolean = false;

  private _dbInstance: Loki;

  constructor(private _env: Environment) {
    this._dbInstance = this._createDbInstance(_env.DATABASE_NAME);
    this._initializeDb();
  }

  public getDbInstance(): Loki {
    return this._dbInstance;
  }

  private _createDbInstance(dbName: string): Loki {
    return new Loki(dbName, {
      persistenceMethod: PERSISTENCE_METHOD,
    });
  }

  private _initializeDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dbInstance.loadDatabase({}, () => {
        this._initializeData();

        this.isInitialized = true;
        resolve();
      });
    });
  }

  private _initializeData() {
    this._env.REQUIRED_COLLECTIONS.forEach((collectionName) => {
      let collection = this._dbInstance.getCollection(collectionName);

      if (!collection) {
        collection = this._dbInstance.addCollection(collectionName);

        if (
          collection.count() === 0 &&
          INITIAL_COLLECTIONS_DATA[collectionName]
        ) {
          INITIAL_COLLECTIONS_DATA[collectionName].forEach((record: any) => {
            collection.insert(record);
          });
        }
      }
    });
  }
}
