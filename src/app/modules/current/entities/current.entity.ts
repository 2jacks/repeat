import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TrainingProgram } from '../../training-program/entities/training-program.entity';

@Entity('current')
export class Current {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'training_program_start', nullable: true })
  trainingProgramStart!: number;

  @OneToOne(() => TrainingProgram, { nullable: true })
  @JoinColumn({ name: 'active_training_program' })
  activeTrainingProgram!: TrainingProgram;
}
