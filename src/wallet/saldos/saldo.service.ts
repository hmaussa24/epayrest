import { Injectable, NotFoundException } from '@nestjs/common';
import { SaldoUsuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CargarSaldoDto } from 'src/wallet/dtos/cargar-saldo.dto';

@Injectable()
export class SaldoService {
    constructor(private prisma: PrismaService) {}

  async cargarSaldo(cargarSaldoDto: CargarSaldoDto): Promise<SaldoUsuario> {
    const { documento, celular, monto } = cargarSaldoDto;
    const user = await this.prisma.usuario.findFirst({
      where: { documento, celular },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con documento ${documento} y celular ${celular} no encontrado`);
    }
    let saldoUsuario = await this.prisma.saldoUsuario.findUnique({
      where: { usuarioId: user.id },
    });

    if (!saldoUsuario) {
      saldoUsuario = await this.prisma.saldoUsuario.create({
        data: {
          usuarioId: user.id,
          saldo: monto,
        },
      });
    } else {
      saldoUsuario = await this.prisma.saldoUsuario.update({
        where: { usuarioId: user.id },
        data: {
          saldo: saldoUsuario.saldo + monto,
        },
      });
    }

    return saldoUsuario;
  }

  async consultarSaldo(documento: string, celular: string): Promise<number> {
    const user = await this.prisma.usuario.findFirst({
      where: { documento, celular },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con documento ${documento} y celular ${celular} no encontrado`);
    }

    const saldoUsuario = await this.prisma.saldoUsuario.findUnique({
      where: { usuarioId: user.id },
    });

    if (!saldoUsuario) {
      throw new NotFoundException(`Saldo no encontrado para el usuario con documento ${documento}`);
    }

    return saldoUsuario.saldo;
  }
}
