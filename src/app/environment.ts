export interface IEnvironment {
  DATABASE_NAME: string;
}

export class Environment implements IEnvironment {
  public DATABASE_NAME: string;

  constructor(config: IEnvironment) {
    this.DATABASE_NAME = config.DATABASE_NAME;
  }
}

export const CEnvironment = new Environment({
  DATABASE_NAME: 'repeat',
});
