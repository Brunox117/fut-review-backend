import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const handleErrors = (error: any) => {
  if (error instanceof HttpException) {
    throw error;
  }
  throw new InternalServerErrorException(
    'Unknown error please, contact the server admin',
  );
};
