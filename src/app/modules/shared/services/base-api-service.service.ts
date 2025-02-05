import { Collection } from 'lokijs';
import { DatabaseService } from '../../../services/database.service';
import { TCommonId } from '../models/CommonId';

export abstract class BaseRegistryService<TModel extends any = any> {
  protected _collectionName: string = 'REQUIRED_COLLECTION_NAME';

  constructor(protected _dbService: DatabaseService) {}

  public getAll(): TModel[] {
    return this.getCollection().find();
  }

  public getById(id: string | number): TModel {
    return this.getCollection().findOne({ id: id });
  }

  public create(newRecord: TModel | TModel[]) {
    this.getCollection().insert(newRecord);
    this._dbService.getDbInstance().saveDatabase();
  }

  public delete(id: string) {
    this.getCollection().remove({ id: id });
    this._dbService.getDbInstance().saveDatabase();
  }

  public update(updatedRecord: TModel) {
    this.getCollection().update(updatedRecord);
    this._dbService.getDbInstance().saveDatabase();
  }

  public getCollection(): Collection {
    return this._dbService.getDbInstance().getCollection(this._collectionName);
  }

  public createCollection(): void {
    if (this._collectionName) {
      this._dbService.getDbInstance().addCollection(this._collectionName);
    }
  }

  protected _requiredCollection(): void {
    if (!this.getCollection()) {
      this.createCollection();
    }
  }

  protected replaceIdWithModel<TService extends BaseRegistryService>(
    targetService: TService,
    ids: TCommonId | TCommonId[]
  ) {
    if (Array.isArray(ids)) {
      const models = ids.map((id) => {
        return targetService.getById(id);
      });

      return models;
    } else {
      return targetService.getById(ids);
    }
  }
}
