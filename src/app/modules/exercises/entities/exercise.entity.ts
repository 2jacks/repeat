import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { MuscleGroup } from '../../muscle-groups/entities/muscle-group.entity';
import { TrainingExercise } from '../../training/entities/training-exercise.entity';

@Entity('exercise')
export class Exercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToMany(() => MuscleGroup, (muscleGroup) => muscleGroup.exercises)
  @JoinTable({
    name: 'muscle_group_to_exercise', // Указываем имя связующей таблицы
    joinColumn: { name: 'exercise_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'muscle_group_id', referencedColumnName: 'id' },
  })
  muscleGroups!: MuscleGroup[];

  @OneToMany(
    () => TrainingExercise,
    (trainingExercise) => trainingExercise.exercise
  )
  trainingExercises!: TrainingExercise[];
}
