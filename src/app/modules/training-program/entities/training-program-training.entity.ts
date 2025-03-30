import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
  JoinColumn,
} from 'typeorm';
import { TrainingProgram } from './training-program.entity';
import { Training } from '../../training/entities/training.entity';

@Entity('training_program_to_training')
export class TrainingProgramTraining {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => TrainingProgram, (program) => program.trainings)
  @JoinColumn({ name: 'program_id' })
  program!: Relation<TrainingProgram>;

  @ManyToOne(() => Training, (training) => training.trainingExercises)
  @JoinColumn({ name: 'training_id' })
  training!: Relation<Training>;

  @Column({ name: 'day_of_week' })
  dayOfWeek!: number;
}
