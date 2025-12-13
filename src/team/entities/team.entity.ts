import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  country: string;

  @Column('text')
  logoUrl?: string;

  @Column('text')
  abbreviation: string;
}
