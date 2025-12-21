import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { handleErrors } from 'src/common/utils/handle-errors';
import { MatchService } from 'src/match/match.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger('ReviewService');
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly matchService: MatchService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    try {
      const { comment, rating, match_id } = createReviewDto;

      const match = await this.matchService.findOne(match_id);
      if (!match) {
        throw new BadRequestException('Match not found');
      }
      const review = this.reviewRepository.create({
        comment,
        rating,
        review_date: new Date(),
        match_id: match.id,
        archived: false,
        user_id: user.id,
      });
      await this.reviewRepository.save(review);
      return {
        message: 'Review created successfully',
        review,
      };
    } catch (error) {
      this.logger.error(`[create] Error ${error}`);
      handleErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const reviews = await this.reviewRepository.find({
        take: limit,
        skip: offset,
        relations: ['match', 'user'],
      });
      return reviews;
    } catch (error) {
      this.logger.error(`[findAll] Error ${error}`);
      handleErrors(error);
    }
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
