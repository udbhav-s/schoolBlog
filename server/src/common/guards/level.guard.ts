import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const level: number = this.reflector.get<number>('level', context.getHandler());
    if (!level) return true;
    const request = context.switchToHttp().getRequest();
    return (request.user.level >= level);
  }
}