import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Usuario } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async createUser(createUserDto: CreateUserDto) {
    const { documento, nombres, email, celular } = createUserDto;

    // Creación del usuario en la base de datos usando Prisma
    return this.prisma.usuario.create({
      data: {
        documento,
        nombres,
        email,
        celular,
      },
    });
  }

  async getUserByDocumento(documento: string): Promise<Usuario> {
    const user = await this.prisma.usuario.findUnique({
      where: { documento },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con documento ${documento} no encontrado`); // Manejo de errores si no se encuentra el usuario
    }

    return user; // Retornar el usuario encontrado
  }
}
