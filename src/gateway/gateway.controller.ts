import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { CargarSaldoDto } from 'src/wallet/dtos/cargar-saldo.dto';
import { SaldoUsuario, Usuario } from '@prisma/client';
import { CreateUserDto } from 'src/wallet/dtos/create-user.dto';
import { ValidarCompraDto } from 'src/wallet/dtos/confirmar-compra.dto';

@Controller('api')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) { }

  @Get('user/:documento')
  async findOne(@Param('documento') documento: string) {
    return this.gatewayService.getUserByDocumento(documento); // Obtener un usuario por documento
  }

  @Get('consultar-saldo')
  async consultarSaldo(
    @Query('documento') documento: string,
    @Query('celular') celular: string
  ): Promise<{ saldo: number }> {
    const saldo = await this.gatewayService.consultarSaldo(documento, celular);
    return { saldo };
  }


  @Put('cargar-saldo')
  async cargarSaldo(@Body() cargarSaldoDto: CargarSaldoDto) {
    return this.gatewayService.cargarSaldo(cargarSaldoDto);
  }

  @Post('user')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return this.gatewayService.createUser(createUserDto);
  }

  @Post('comprar')
  async registrarCompra(
    @Body('usuarioId') usuarioId: number,
    @Body('descripcion') descripcion: string,
    @Body('valor') valor: number,
  ) {
    return this.gatewayService.registrarCompra(usuarioId, descripcion, valor);
  }


  @Post('validar-token')
  @UsePipes(new ValidationPipe())
  async validarTokenYCompletarCompra(
    @Body() validarCompraDto: ValidarCompraDto,
  ) {
    const { sessionId, token} = validarCompraDto;
    return this.gatewayService.validarTokenYCompletarCompra(validarCompraDto);
  }
}
