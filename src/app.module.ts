import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { WalletModule } from './wallet/wallet.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [PrismaModule, WalletModule, GatewayModule, AppModule],
})
export class AppModule {}
