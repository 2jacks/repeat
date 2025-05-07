import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('_set')
export class Set {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  number!: number;

  @Column()
  reps!: number;

  @Column('float')
  weight!: number;

  @Column()
  rest!: number;
}
