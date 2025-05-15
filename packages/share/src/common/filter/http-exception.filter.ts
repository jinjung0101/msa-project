import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // getResponse() 결과가 object인지 확인
    const responseBody =
      exception instanceof HttpException
        ? (() => {
            const res = exception.getResponse();
            return typeof res === "object" ? res : { message: String(res) };
          })()
        : { message: "Internal server error" };

    resp.status(status).json({
      statusCode: status,
      ...responseBody,
      timestamp: new Date().toISOString(),
    });
  }
}
