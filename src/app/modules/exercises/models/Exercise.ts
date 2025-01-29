import { IMuscleGroup } from '../../muscle-groups/models/MuscleGroup';

export interface IExercise {
  id: number;
  name: string;
  muscle_groups: IMuscleGroup[];
  description: string;
}
