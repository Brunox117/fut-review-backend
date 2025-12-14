import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from './entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/team/entities/team.entity';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
  imports: [TypeOrmModule.forFeature([Match, Team])],
  exports: [MatchService],
})
export class MatchModule {}
