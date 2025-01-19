import { ICollectionsKeys } from "./assets/initial-collections-data";

export interface IEnvironment {
  DATABASE_NAME: string;
  REQUIRED_COLLECTIONS: ICollectionsKeys[];
}

export class Environment implements IEnvironment {
  public DATABASE_NAME: string;
  public REQUIRED_COLLECTIONS: ICollectionsKeys[];

  constructor(config: IEnvironment) {
    this.DATABASE_NAME = config.DATABASE_NAME;
    this.REQUIRED_COLLECTIONS = config.REQUIRED_COLLECTIONS;
  }
}

export const CEnvironment = new Environment({
  DATABASE_NAME: 'repeat',
  REQUIRED_COLLECTIONS: [
    'app_settings',
    'user_data',
    'exercises',
    'muscle_groups',
  ],
});
