import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Team } from '../team/entities/team.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MatchService {
  private readonly logger = new Logger('MatchService');
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    try {
      // Validate that both teams exist
      const [homeTeam, awayTeam] = await Promise.all([
        this.teamRepository.findOneBy({ id: createMatchDto.home_team_id }),
        this.teamRepository.findOneBy({ id: createMatchDto.away_team_id }),
      ]);

      if (!homeTeam) {
        throw new BadRequestException(
          `Home team with id ${createMatchDto.home_team_id} not found`,
        );
      }

      if (!awayTeam) {
        throw new BadRequestException(
          `Away team with id ${createMatchDto.away_team_id} not found`,
        );
      }

      // Prevent same team playing against itself
      if (createMatchDto.home_team_id === createMatchDto.away_team_id) {
        throw new BadRequestException(
          'Home team and away team cannot be the same',
        );
      }

      const match = this.matchRepository.create(createMatchDto);
      await this.matchRepository.save(match);
      return match;
    } catch (error) {
      this.logger.error(`[create] Error ${error}`);
      this.handleErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const matches = await this.matchRepository.find({
        take: limit,
        skip: offset,
        relations: ['homeTeam', 'awayTeam'],
      });
      return matches;
    } catch (error) {
      this.logger.error(`[findAll] Error ${error}`);
      this.handleErrors(error);
    }
  }

  async findOne(id: string) {
    try {
      const match = await this.matchRepository.findOne({
        where: { id },
        relations: ['homeTeam', 'awayTeam'],
      });
      if (!match) {
        throw new NotFoundException('Match not found');
      }
      return match;
    } catch (error) {
      this.logger.error(`[findOne] Error ${error}`);
      this.handleErrors(error);
    }
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    try {
      const match = await this.matchRepository.findOneBy({ id });
      if (!match) {
        throw new NotFoundException('Match not found');
      }

      // Validate teams if they are being updated
      if (updateMatchDto.home_team_id) {
        const homeTeam = await this.teamRepository.findOneBy({
          id: updateMatchDto.home_team_id,
        });
        if (!homeTeam) {
          throw new BadRequestException(
            `Home team with id ${updateMatchDto.home_team_id} not found`,
          );
        }
      }

      if (updateMatchDto.away_team_id) {
        const awayTeam = await this.teamRepository.findOneBy({
          id: updateMatchDto.away_team_id,
        });
        if (!awayTeam) {
          throw new BadRequestException(
            `Away team with id ${updateMatchDto.away_team_id} not found`,
          );
        }
      }

      // Prevent same team playing against itself
      const finalHomeTeamId = updateMatchDto.home_team_id || match.home_team_id;
      const finalAwayTeamId = updateMatchDto.away_team_id || match.away_team_id;

      if (finalHomeTeamId === finalAwayTeamId) {
        throw new BadRequestException(
          'Home team and away team cannot be the same',
        );
      }

      await this.matchRepository.update(id, updateMatchDto);
      return this.matchRepository.findOne({
        where: { id },
        relations: ['homeTeam', 'awayTeam'],
      });
    } catch (error) {
      this.logger.error(`[update] Error ${error}`);
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const match = await this.matchRepository.findOneBy({ id });
      if (!match) {
        throw new NotFoundException('Match not found');
      }
      await this.matchRepository.delete(id);
      return { message: 'Match deleted successfully' };
    } catch (error) {
      this.logger.error(`[remove] Error ${error}`);
      this.handleErrors(error);
    }
  }

  handleErrors(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(
      'Unknown error please, contact the server admin',
    );
  }
}
