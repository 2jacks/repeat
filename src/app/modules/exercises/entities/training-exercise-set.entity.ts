import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToOne,
} from 'typeorm';
import { Set } from './set.entity';
import { TrainingExercise } from '../../training/entities/training-exercise.entity';

@Entity('training_exercise_set')
export class TrainingExerciseSet {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => TrainingExercise,
    (trainingExercise) => trainingExercise.sets
  )
  @JoinColumn({ name: 'training_exercise_id' })
  exercise!: Relation<TrainingExercise>;

  @OneToOne(() => Set)
  @JoinColumn({ name: 'set_id' })
  set!: Relation<Set>;
}
