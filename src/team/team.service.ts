import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Team } from './entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  private readonly logger = new Logger('TeamService');
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    try {
      const team = this.teamRepository.create(createTeamDto);
      await this.teamRepository.save(team);
      return team;
    } catch (error) {
      this.logger.error(`[create] error ${error}`);
      this.handleErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const teams = await this.teamRepository.find({
        take: limit,
        skip: offset,
      });
      return teams;
    } catch (error) {
      this.logger.error(`[findAll] error ${error}`);
      this.handleErrors(error);
    }
  }

  async findOne(id: string) {
    try {
      const team = await this.teamRepository.findOneBy({ id });
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      return team;
    } catch (error) {
      this.logger.error(`[findOne] error ${error}`);
      this.handleErrors(error);
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    try {
      const team = await this.teamRepository.findOneBy({ id });
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      await this.teamRepository.update(id, updateTeamDto);
      return this.teamRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error(`[update] error ${error}`);
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const team = await this.teamRepository.findOneBy({ id });
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      await this.teamRepository.delete(id);
      return { message: 'Team deleted successfully' };
    } catch (error) {
      this.logger.error(`[remove] error ${error}`);
      this.handleErrors(error);
    }
  }

  // Métodos para obtener partidos del equipo
  async getTeamWithMatches(id: string) {
    try {
      const team = await this.teamRepository.findOne({
        where: { id },
        relations: ['homeMatches', 'awayMatches'],
      });
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      return team;
    } catch (error) {
      this.logger.error(`[getTeamWithMatches] error ${error}`);
      this.handleErrors(error);
    }
  }

  async getAllTeamMatches(id: string) {
    try {
      const team = await this.teamRepository.findOne({
        where: { id },
        relations: ['homeMatches', 'awayMatches'],
      });
      if (!team) {
        throw new NotFoundException('Team not found');
      }

      const allMatches = [
        ...team.homeMatches.map((match) => ({ ...match, role: 'home' })),
        ...team.awayMatches.map((match) => ({ ...match, role: 'away' })),
      ];

      return {
        team: {
          id: team.id,
          name: team.name,
          abbreviation: team.abbreviation,
          country: team.country,
        },
        totalMatches: allMatches.length,
        homeMatchesCount: team.homeMatches.length,
        awayMatchesCount: team.awayMatches.length,
        matches: allMatches,
      };
    } catch (error) {
      this.logger.error(`[getAllTeamMatches] error ${error}`);
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
