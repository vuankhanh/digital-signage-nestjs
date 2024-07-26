import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { MongoError } from 'mongodb';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
    status: number;
    error: any;
    message: string;
    catch(exception: MongoError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        switch (exception.code) {
            case 11000:
                this.status = HttpStatus.CONFLICT;
                this.error = this.duplicateKeyError(exception);
                this.message = 'Conflict';
                break;
            default:
                this.status = HttpStatus.BAD_REQUEST;
                this.error = exception.message;
                this.message = 'Bad Request';
                break;
        }
        
        response.status(this.status).json({
            statusCode: this.status,
            error: this.error,
            message: this.message,
        });
    }

    private duplicateKeyError(exception: MongoError) {
        const codeName = exception['codeName'];
        const keyValue = exception['keyValue'];

        return { codeName, keyValue }
    }
}