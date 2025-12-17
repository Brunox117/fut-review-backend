import { Review } from 'src/review/entities/review.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  name: string;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @OneToMany(() => Review, (review) => review.user_id)
  reviews: Review[];
}
