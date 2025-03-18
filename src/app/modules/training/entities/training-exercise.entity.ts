import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  Relation,
  JoinColumn,
} from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { Training } from './training.entity';

@Entity('training_to_exercise')
export class TrainingExercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Training, (training) => training.trainingExercises)
  @JoinColumn({ name: 'training_id' })
  training!: Relation<Training>;

  @ManyToOne(() => Exercise, (exercise) => exercise.trainingExercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise!: Relation<Exercise>;

  @Column()
  sets!: number;

  @Column()
  reps!: number;
}
