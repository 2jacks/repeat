import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('muscle_group')
export class MuscleGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(() => Exercise, (exercise) => exercise.muscleGroups)
  exercises!: Exercise[];
}
