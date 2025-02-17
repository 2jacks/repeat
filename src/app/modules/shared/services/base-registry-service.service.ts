import { DatabaseService } from '../../../services/database.service';

export abstract class BaseRegistryService<TModel extends any = any> {
  protected _collectionName!: string;

  constructor(protected _dbService: DatabaseService) {}

  get db() {
    return this._dbService.getDatabaseConnection();
  }

  public async getAll(): Promise<TModel[]> {
    const query = `SELECT * FROM "${this._collectionName}"`;

    return (
      (await this._dbService.getDatabaseConnection().query(query)).values ?? []
    );
  }

  public async getById(id: string | number): Promise<TModel> {
    return null as TModel;
    // this.getCollection().findOne({ id: id });
  }

  public async create(newRecord: TModel[]) {
    // this.getCollection().insert(newRecord);
  }

  public async delete(id: string) {
    // this.getCollection().remove({ id: id });
  }

  public async update(updatedRecord: TModel) {
    // this.getCollection().update(updatedRecord);
  }
}
