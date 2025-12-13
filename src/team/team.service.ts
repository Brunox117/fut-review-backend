import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TeamService {
  create(createTeamDto: CreateTeamDto) {
    return 'This action adds a new team';
  }

  findAll(paginationDto: PaginationDto) {
    return `This action returns all team`;
  }

  findOne(id: string) {
    return `This action returns a #${id} team`;
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: string) {
    return `This action removes a #${id} team`;
  }
}
