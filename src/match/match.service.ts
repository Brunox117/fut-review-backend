import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MatchService {
  private readonly logger = new Logger('MatchService');
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}
  async create(createMatchDto: CreateMatchDto) {
    try {
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
      });
      return matches;
    } catch (error) {
      this.logger.error(`[findAll] Error ${error}`);
      this.handleErrors(error);
    }
  }

  async findOne(id: string) {
    try {
      const match = await this.matchRepository.findOneBy({ id });
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
      await this.matchRepository.update(id, updateMatchDto);
      return this.matchRepository.findOneBy({ id });
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
