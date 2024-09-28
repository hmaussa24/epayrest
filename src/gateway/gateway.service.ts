import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CargarSaldoDto } from 'src/wallet/dtos/cargar-saldo.dto';
import { CreateUserDto } from 'src/wallet/dtos/create-user.dto';
import { ValidarCompraDto } from 'src/wallet/dtos/confirmar-compra.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewayService {

  constructor(private readonly httpService: HttpService, private readonly jwtService: JwtService, private configService: ConfigService) { }
  private readonly usersServiceUrl = this.configService.get('URL_WALLET')

  // Método para generar el token JWT que será enviado con cada solicitud
  private generarJwtToken() {
    const payload = { role: 'microservicio' };
    return this.jwtService.sign(payload);
  }

  async getUserByDocumento(documento: string) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.usersServiceUrl}/user/${documento}`, { headers }),
      );
      return response.data;
    } catch (err) {
      throw new NotFoundException(`Usuario con documento ${documento} no encontrado`);
    }
  }

  async consultarSaldo(documento: string, celular: string) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.usersServiceUrl}/consultar-saldo?documento=${documento}&celular=${celular}`, { headers }),
      );
      return response.data;
    } catch (err) {
      throw new NotFoundException('Error al consultar el saldo');
    }
  }

  async cargarSaldo(cargarSaldoDto: CargarSaldoDto) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    try {
      const response = await lastValueFrom(
        this.httpService.put(`${this.usersServiceUrl}/cargar-saldo`, cargarSaldoDto, { headers }),
      );
      return response.data;
    } catch (err) {
      throw new NotFoundException('No se pudo cargar el saldo');
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/user`, createUserDto, { headers }),
      );
      return response.data
    } catch (err) {
      throw new NotFoundException('El usuario no se pudo crear o ya existe!!')
    }
  }


  async registrarCompra(usuarioId: number, descripcion: string, valor: number) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    try {
      const payload = { usuarioId, descripcion, valor };
      const response = await lastValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/comprar`, payload, { headers }),
      );
      return response.data;
    } catch (err) {
      throw new NotFoundException("No se pudo realizar la compra!!");
    }
  }

  async validarTokenYCompletarCompra(validarCompraDto: ValidarCompraDto) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.usersServiceUrl}/validar-token`, validarCompraDto, { headers }),
      );
      return response.data;
    } catch (err) {
      throw new NotFoundException('Token invalido o vencido');
    }

  }
}