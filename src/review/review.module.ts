import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/match/entities/match.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MatchModule } from 'src/match/match.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Review, Match]), AuthModule, MatchModule],
  exports: [ReviewService],
})
export class ReviewModule {}
