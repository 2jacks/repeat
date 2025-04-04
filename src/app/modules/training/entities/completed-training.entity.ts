import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Relation,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Training } from './training.entity';
import { CompletedExercise } from './completed-exercise.entity';

@Entity('completed_training')
export class CompletedTraining {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Training)
  @JoinColumn({ name: 'training_id' })
  training!: Relation<Training>;

  @Column()
  date!: Date;

  @OneToMany(
    () => CompletedExercise,
    (completedExercise) => completedExercise.completedTraining
  )
  completedExercises!: Relation<CompletedExercise>[];
}
