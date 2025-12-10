import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  score: string;
}
