import { User } from 'src/auth/entities/user.entity';
import { Match } from 'src/match/entities/match.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  comment: string;

  @Column('number')
  rating: number;

  @Column('date', { nullable: true })
  review_date?: Date;

  @Column('boolean', { default: false })
  archived: boolean;

  @Column('uuid')
  match_id: string;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
