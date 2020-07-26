import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import logger from "../util/winston";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const method = request.method;
    const url = request.originalUrl;

    // log only important actions
    const shouldLog = ["POST", "PUT", "DELETE"].includes(method) || /^\/api\/user\/(oauth|saml)/.test(url);

    const log = response => {
      const message = `[${method}] | ${request.user.name} (${request.user.email}) - ${url} [${response.statusCode}]`;
      logger.info(message, {
        name: request.user.name || "(No name)",
        email: request.user.email,
        status: response.statusCode,
        method,
        url
      });
    }

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        if (shouldLog) log(response);
      }),
      catchError((error) => {
        const response = context.switchToHttp().getResponse();
        if (shouldLog) log(response);
        return throwError(error);
      }),
    );
  }
}
