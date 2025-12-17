import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { Team } from '../../team/entities/team.entity';
import { Review } from 'src/review/entities/review.entity';

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

  @OneToMany(() => Review, (review) => review.match_id)
  reviews: Review[];

  //TODO define lineup for home and away teams
}
