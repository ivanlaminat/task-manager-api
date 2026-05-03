import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Указываем, что токен нужно искать в заголовке Authorization (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Отклонять просроченные токены
      // Секретный ключ для проверки подлинности
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret',
    });
  }

  // Этот метод вызывается автоматически, если токен валидный
  validate(payload: JwtPayload) {
    // Возвращаем объект, который NestJS автоматически положит в req.user
    return { id: payload.sub, email: payload.email };
  }
}
