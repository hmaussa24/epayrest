import { IsNotEmpty, IsString, IsNumber, Min, Length } from 'class-validator';

export class ValidarCompraDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'El token debe tener exactamente 6 caracteres.' })
  token: string;
}