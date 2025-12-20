import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  create(createReviewDto: CreateReviewDto, user: User) {
    const { comment, rating, match_id } = createReviewDto;
    // TODO validate that the match exists
    // const review = this.reviewRepository.create({
    //   comment,
    //   rating,
    //   review_date: new Date(),
    //   match_id,
    //   archived: false,
    //   user_id: user.id,
    // });
    // return this.reviewRepository.save(review);
    return {
      comment,
      rating,
      match_id,
      user_id: user.id,
    };
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
