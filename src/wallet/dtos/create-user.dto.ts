import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'El documento debe tener exactamente 10 caracteres' })
  documento: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 255, { message: 'El nombre debe tener al menos 4 caracteres' })
  nombres: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'El celular debe tener exactamente 10 dígitos' })
  celular: string;
}