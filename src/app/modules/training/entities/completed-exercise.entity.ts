import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { CompletedTraining } from './completed-training.entity';
import { CompletedExerciseSet } from '../../exercises/entities/completed-exercise-set.entity';

@Entity('completed_exercise')
export class CompletedExercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Exercise)
  @JoinColumn({ name: 'exercise_id' })
  exercise!: Relation<Exercise>;

  @ManyToOne(
    () => CompletedTraining,
    (completedTraining) => completedTraining.exercises
  )
  @JoinColumn({ name: 'completed_training_id' })
  completedTraining!: Relation<CompletedTraining>;

  @OneToMany(
    () => CompletedExerciseSet,
    (completedExerciseSet) => completedExerciseSet.completedExercise
  )
  sets!: Relation<CompletedExerciseSet>[];
}
