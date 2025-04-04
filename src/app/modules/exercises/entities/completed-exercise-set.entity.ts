import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToOne,
} from 'typeorm';
import { Set } from './set.entity';
import { CompletedExercise } from '../../training/entities/completed-exercise.entity';

@Entity('completed_exercise_set')
export class CompletedExerciseSet {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Set)
  @JoinColumn({ name: 'set_id' })
  set!: Relation<Set>;

  @ManyToOne(
    () => CompletedExercise,
    (completedExercise) => completedExercise.sets
  )
  @JoinColumn({ name: 'completed_exercise_id' })
  completedExercise!: Relation<CompletedExercise>;
}
