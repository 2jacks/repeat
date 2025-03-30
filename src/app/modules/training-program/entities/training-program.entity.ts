import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { TrainingProgramTraining } from './training-program-training.entity';

@Entity('training_program')
export class TrainingProgram {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ name: 'duration_weeks' })
  durationWeeks!: number;

  @Column()
  goal!: string;

  @OneToMany(
    () => TrainingProgramTraining,
    (trainingProgramTraining) => trainingProgramTraining.program
  )
  trainings!: Relation<TrainingProgramTraining[]>;
}
