import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, accountSchema } from './schemas/account.schema';
import { JwtModule } from '@nestjs/jwt';
import { Refresh_Token, refreshTokenSchema } from 'src/modules/auth/schemas/refresh_token.schema';
import { RefreshTokenService } from 'src/shared/services/refresh_token.service';
import { AccountService } from 'src/shared/services/account.service';
import { AuthGuard } from '../../shared/guards/auth.guard';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase()
      },
      {
        name: Refresh_Token.name,
        schema: refreshTokenSchema,
        collection: Refresh_Token.name.toLowerCase()
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    RefreshTokenService,
    AuthGuard
  ]
})
export class AuthModule { }
