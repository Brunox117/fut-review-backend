import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  score: string;

  @IsUUID()
  home_team_id: string;

  @IsUUID()
  away_team_id: string;

  @IsDateString()
  @IsOptional()
  match_date: Date;
}
