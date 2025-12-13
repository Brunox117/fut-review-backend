import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  logoUrl?: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;
}
