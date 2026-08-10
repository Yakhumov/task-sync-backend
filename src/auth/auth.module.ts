import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';

export const getJwtConfigs = (config: ConfigService) => ({
  secret: config.get<string>('JWT_SECRET'), // берём из .env
  signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h' },
});

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }), // чтобы ConfigService был доступен
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
