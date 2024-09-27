import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Usuario } from '@prisma/client';
import { CargarSaldoDto } from 'src/wallet/dtos/cargar-saldo.dto';
import { CreateUserDto } from 'src/wallet/dtos/create-user.dto';
import { ValidarCompraDto } from 'src/wallet/dtos/confirmar-compra.dto';

@Injectable()
export class GatewayService {

  constructor(private readonly httpService: HttpService, private readonly jwtService: JwtService) {}

  private readonly usersServiceUrl = 'http://localhost:3000/wallet'; 

  // Método para generar el token JWT que será enviado con cada solicitud
  private generarJwtToken() {
    const payload = { role: 'microservicio' };
    return this.jwtService.sign(payload);
  }


  async getUserByDocumento(documento: string){
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    const response = await lastValueFrom(
      this.httpService.get(`${this.usersServiceUrl}/user/${documento}`, { headers }),
    );
    return response.data
  }

  async consultarSaldo(documento: string, celular: string) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    const response = await lastValueFrom(
      this.httpService.get(`${this.usersServiceUrl}/consultar-saldo?documento=${documento}&celular=${celular}`, { headers }),
    );
    return response.data;
  }

  async cargarSaldo(cargarSaldoDto: CargarSaldoDto) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    const response = await lastValueFrom(
      this.httpService.put(`${this.usersServiceUrl}/cargar-saldo`, cargarSaldoDto, { headers }),
    );
    return response.data;
  }

  async createUser(createUserDto: CreateUserDto) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    const response = await lastValueFrom(
      this.httpService.post(`${this.usersServiceUrl}/user`, createUserDto, { headers }),
    );
    return response.data
  }


  async registrarCompra(usuarioId: number, descripcion: string, valor: number) {
    const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
    const payload = { usuarioId, descripcion, valor };
    const response = await lastValueFrom(
      this.httpService.post(`${this.usersServiceUrl}/comprar`, payload, { headers }),
    );
    return response.data;
  }

  async validarTokenYCompletarCompra(validarCompraDto: ValidarCompraDto) {
  const headers = { Authorization: `Bearer ${this.generarJwtToken()}` };
  const response = await lastValueFrom(
    
    this.httpService.post(`${this.usersServiceUrl}/validar-token`, validarCompraDto, { headers }),
  );
  return response.data;
}
}