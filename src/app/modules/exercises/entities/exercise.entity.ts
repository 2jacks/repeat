import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MuscleGroup } from '../../muscle-groups/entities/muscle-group.entity';

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
    name: 'muscle_group_exercise', // Указываем имя связующей таблицы
    joinColumn: { name: 'exercise_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'muscle_group_id', referencedColumnName: 'id' },
  })
  muscleGroups!: MuscleGroup[];
}
