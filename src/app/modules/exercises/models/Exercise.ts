import { IMuscleGroup } from '../../muscle-groups/models/MuscleGroup';
import { TCommonId } from '../../shared/models/CommonId';

export interface IExercise {
  id: number;
  name: string;
  muscle_groups: TCommonId[];
  description: string;
}
