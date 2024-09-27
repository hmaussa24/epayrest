import { IsNotEmpty, IsNumber, IsString, Min, Length } from 'class-validator';

export class CargarSaldoDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'El celular debe tener exactamente 10 dígitos' })
  celular: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'El documento debe tener exactamente 10 dígitos' })
  documento: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'El monto debe ser al menos 1' })
  monto: number;
}