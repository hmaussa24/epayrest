import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './users/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SaldoUsuario, Usuario } from '@prisma/client';
import { CargarSaldoDto } from './dtos/cargar-saldo.dto';
import { SaldoService } from './saldos/saldo.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly userService: UserService, private readonly saldoService: SaldoService) {}

  @Post('user')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('user/:documento')
  async findOne(@Param('documento') documento: string): Promise<Usuario> {
    return this.userService.getUserByDocumento(documento); // Obtener un usuario por documento
  }

  @Put('cargar-saldo')
  async cargarSaldo(@Body() cargarSaldoDto: CargarSaldoDto): Promise<SaldoUsuario> {
    return this.saldoService.cargarSaldo(cargarSaldoDto);
  }

  @Get('consultar-saldo')
  async consultarSaldo(
    @Query('documento') documento: string,
    @Query('celular') celular: string
  ): Promise<{ saldo: number }> {
    const saldo = await this.saldoService.consultarSaldo(documento, celular);
    return { saldo };
  }
}
