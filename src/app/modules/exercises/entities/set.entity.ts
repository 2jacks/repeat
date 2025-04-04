import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
} from 'typeorm';
import { TrainingExerciseSet } from './training-exercise-set.entity';
import { CompletedExerciseSet } from './completed-exercise-set.entity';

@Entity('_set')
export class Set {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  number!: number;

  @Column()
  reps!: number;

  @Column('float')
  weight!: number;
}
