import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { UserService } from './users/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SaldoService } from './saldos/saldo.service';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [UserService, SaldoService],
})
export class WalletModule {}
