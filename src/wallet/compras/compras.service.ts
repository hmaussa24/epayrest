import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';  // Para generar el token de 6 dígitos

@Injectable()
export class ComprasService {
    constructor(private readonly prisma: PrismaService) { }

    generateToken(): string {
        return randomInt(100000, 999999).toString();
    }

    async sendTokenByEmail(email: string, token: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Tu Token de Seguridad',
            text: `Tu token de seguridad es: ${token}`,
        };

        await transporter.sendMail(mailOptions);
    }

    async registrarCompra(usuarioId: number, descripcion: string, valor: number) {

        const usuario = await this.prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        const token = this.generateToken();
        const sesionId = this.generateToken();

        const session = await this.prisma.sesion.create({
            data: {
                token,
                sesionId: sesionId.toString(),
                usuario: {
                    connect: { id: usuarioId },
                },
                expiresAt: new Date(Date.now() + 1000 * 60 * 15),
            },
        });

        const compra = await this.prisma.compra.create({
            data: {
                descripcion,
                valor,
                usuario: {
                    connect: { id: usuarioId },
                },
                sesion: {
                    connect: { id: session.id },
                },
            },
        });

        // await this.sendTokenByEmail(usuario.email, token);

        return compra;
    }


    private async validarSesionYToken(
        sessionId: string,
        token: string,
    ) {
        return this.prisma.sesion.findFirst({
            where: {
                sesionId: sessionId,
                token: token,
                tokenUsado: false,
                expiresAt: {
                    gte: new Date(),
                },
            },
            include: {
                usuario: true,
            },
        });
    }

    private async verificarSaldoUsuario(
        usuarioId: number,
        valorCompra: number,
    ) {
        const saldoUsuario = await this.prisma.saldoUsuario.findFirst({
            where: {
                usuarioId,
            },
        });

        if (!saldoUsuario || saldoUsuario.saldo < valorCompra) {
            throw new Error('Saldo insuficiente');
        }

        return saldoUsuario;
    }


    private async descontarSaldo(
        saldoUsuarioId: number,
        nuevoSaldo: number,
    ) {
        return this.prisma.saldoUsuario.update({
            where: {
                id: saldoUsuarioId,
            },
            data: {
                saldo: nuevoSaldo,
            },
        });
    }

    private async marcarTokenComoUsado(sesionId: number) {
        return this.prisma.sesion.update({
            where: {
                id: sesionId,
            },
            data: {
                tokenUsado: true,
            },
        });
    }

    private async obtenerValorCompra(sessionId: string) {
        const compra = await this.prisma.compra.findFirst({
          where: {
            sesion: {
              sesionId: sessionId,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
    
        if (!compra) {
          throw new Error('Compra no encontrada para la sesión proporcionada');
        }
    
        return compra.valor;
      }

    async validarTokenYCompletarCompra(
        sessionId: string,
        token: string
    ) {
        try {
            const sesion = await this.validarSesionYToken(sessionId, token);
            if (!sesion) {
                return {
                    mensaje: 'Compra rechazada',
                    motivo: 'Token inválido, expirado o ya usado',
                };
            }

            const valorCompra = await this.obtenerValorCompra(sessionId);
            const saldoUsuario = await this.verificarSaldoUsuario(sesion.usuarioId, valorCompra);
            const nuevoSaldo = saldoUsuario.saldo - valorCompra;

            await this.descontarSaldo(saldoUsuario.id, nuevoSaldo);

            await this.marcarTokenComoUsado(sesion.id);

            return {
                mensaje: 'Compra confirmada',
                motivo: `Compra realizada con éxito. Nuevo saldo: ${nuevoSaldo}`,
            };

        } catch (error) {
            return {
                mensaje: 'Compra rechazada',
                motivo: error.message,
            };
        }
    }

}
