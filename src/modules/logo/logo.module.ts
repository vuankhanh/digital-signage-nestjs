import { Module } from '@nestjs/common';
import { LogoService } from './logo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateCreateLogoGuard } from './guards/validate_create_logo.guard';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Logo, logoSchema } from './schema/logo.schema';
import { LogoController } from './logo.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Logo.name,
        schema: logoSchema,
        collection: Logo.name.toLowerCase()
      },
    ])
  ],
  controllers: [LogoController],
  providers: [LogoService, ValidateCreateLogoGuard, ConfigService, AuthGuard],
})
export class LogoModule {}
