import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  Relation,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Training } from './training.entity';
import { TrainingExerciseSet } from '../../exercises/entities/training-exercise-set.entity';

@Entity('training_to_exercise')
export class TrainingExercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Training, (training) => training.exercises)
  @JoinColumn({ name: 'training_id' })
  training!: Relation<Training>;

  @ManyToOne(() => Exercise, (exercise) => exercise.trainingExercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise!: Relation<Exercise>;

  @OneToMany(
    () => TrainingExerciseSet,
    (trainingExerciseSet) => trainingExerciseSet.exercise
  )
  sets!: Relation<TrainingExerciseSet>[];
}
