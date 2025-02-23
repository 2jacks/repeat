import { Entity, Repository } from 'typeorm';
import { DatabaseService } from '../../../services/database.service';
import { Environment } from 'src/app/environment';

export abstract class BaseRegistryService<TModel extends any = any> {
  constructor(
    protected _dbService: DatabaseService,
    protected _env: Environment
  ) {}

  public get dataSource() {
    return this._dbService.dataSource;
  }

  protected async _saveDataIfWeb() {
    if (this._dbService.platform === 'web') {
      await this._dbService.sqliteConnection.saveToStore(
        this._env.DATABASE_NAME
      );
    }
  }
}
