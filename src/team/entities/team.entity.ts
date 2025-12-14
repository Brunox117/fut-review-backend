import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from '../../match/entities/match.entity';

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

  @Column('boolean', { default: false })
  archived: boolean;

  // Relaciones bidireccionales con partidos
  @OneToMany(() => Match, (match) => match.homeTeam)
  homeMatches: Match[];

  @OneToMany(() => Match, (match) => match.awayTeam)
  awayMatches: Match[];
}
