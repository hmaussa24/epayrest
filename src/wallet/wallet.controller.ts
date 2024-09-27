import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './users/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SaldoUsuario, Usuario } from '@prisma/client';
import { CargarSaldoDto } from './dtos/cargar-saldo.dto';
import { SaldoService } from './saldos/saldo.service';
import { ComprasService } from './compras/compras.service';
import { ValidarCompraDto } from './dtos/confirmar-compra.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly userService: UserService, private readonly saldoService: SaldoService, 
              private readonly comprasService: ComprasService
  ) {}

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
  @UsePipes(new ValidationPipe())
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

  @Post('comprar')
  async registrarCompra(
    @Body('usuarioId') usuarioId: number,
    @Body('descripcion') descripcion: string,
    @Body('valor') valor: number,
  ) {
    return this.comprasService.registrarCompra(usuarioId, descripcion, valor);
  }

  @Post('validar-token')
  @UsePipes(new ValidationPipe())
  async validarTokenYCompletarCompra(
    @Body() validarCompraDto: ValidarCompraDto,
  ) {
    const { sessionId, token} = validarCompraDto;
    return this.comprasService.validarTokenYCompletarCompra(
      sessionId,
      token
    );
  }
}
