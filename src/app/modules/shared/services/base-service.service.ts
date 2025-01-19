import { Collection } from 'lokijs';
import { DatabaseService } from './database.service';

export abstract class BaseService {
  protected _collectionName: string = 'REQUIRED_COLLECTION_NAME';

  constructor(protected _dbService: DatabaseService) {}

  public getAll() {
    this.getCollection().data;
  }

  public getById(id: string) {
    this.getCollection().find({ id: id });
  }

  public create(newRecord: any | any[]) {
    this.getCollection().insert(newRecord);
  }

  public delete(id: string) {
    this.getCollection().remove({ id: id });
  }

  public update(updatedRecord: any) {
    this.getCollection().update(updatedRecord);
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
}
