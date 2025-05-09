import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  Relation,
} from 'typeorm';
import { TrainingExercise } from './training-exercise.entity';

@Entity('training')
export class Training {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => TrainingExercise, (exercise) => exercise.training)
  exercises!: Relation<TrainingExercise[]>;
}
