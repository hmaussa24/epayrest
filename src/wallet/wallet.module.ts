import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { UserService } from './users/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SaldoService } from './saldos/saldo.service';
import { ComprasService } from './compras/compras.service';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [UserService, SaldoService, ComprasService],
})
export class WalletModule {}
