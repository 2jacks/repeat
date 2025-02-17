import { DataSource } from 'typeorm';
import { DatabaseService } from '../../../services/database.service';

export abstract class BaseRegistryService<TModel extends any = any> {
  constructor(protected _dbService: DatabaseService) {}

  public get dataSource() {
    return this._dbService.dataSource;
  }
}
