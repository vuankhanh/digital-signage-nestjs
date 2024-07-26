import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

//For single file
@Injectable()
export class FileProccedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.file) {
      throw new BadRequestException('No file were uploaded.');
    }
    return next.handle();
  }
}

//For multiple files
@Injectable()
export class FilesProccedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.files || request.files.length === 0) {
      throw new BadRequestException('No files were uploaded.');
    }
    return next.handle();
  }
}