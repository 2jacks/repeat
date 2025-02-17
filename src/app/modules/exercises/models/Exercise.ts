import { ISimpleIdentity } from '../../shared/models/SimpleIdentity';

export interface IExercise {
  id: number;
  name: string;
  muscle_groups: ISimpleIdentity[];
  description: string;
}
