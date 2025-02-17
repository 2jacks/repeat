import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('muscle-group')
export class MuscleGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
