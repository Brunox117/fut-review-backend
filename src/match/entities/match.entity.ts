import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Team } from '../../team/entities/team.entity';

@Entity('matches')
export class Match {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  score: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'home_team_id' })
  homeTeam: Team;

  @Column('uuid')
  home_team_id: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: Team;

  @Column('uuid')
  away_team_id: string;

  @Column('date', { nullable: true })
  match_date?: Date;
}
