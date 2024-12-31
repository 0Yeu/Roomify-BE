import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import _ from 'lodash';
/**
 * Handle Error (After getting error from validation.pipe)
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // const request = ctx.getRequest();
    let statusCode = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    // Handle isNotEmpty Error
    if (exceptionResponse.statusCode === 400 && _.isArray(exceptionResponse.message)) {
      const newMessage = await exceptionResponse.message.map((element: any) => {
        if (_.includes(element, ' should not be empty')) {
          const currentObjectName = _.replace(element, ' should not be empty', '');
          return {
            constraints: {
              isNotEmpty: element
            },
            property: currentObjectName
          };
        }
        return element;
      });
      exceptionResponse.message = newMessage;
    }

    // response.status(statusCode).json({
    //   statusCode,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });

    // console.log('http-exception.filter', exception.getResponse());

    // Get Custom Message
    const customMessage = exceptionResponse.error ? exceptionResponse.message : '';

    switch (statusCode) {
      case 401:
        response.status(statusCode).json({
          statusCode,
          message: customMessage || 'Không có dữ liệu',
          error: 'Unauthorized'
        });
        break;
      case 403:
        response.status(statusCode).json({
          statusCode,
          message: customMessage || 'Tài nguyên bị cấm',
          error: 'Forbidden'
        });
        break;
      case 404:
        response.status(statusCode).json({
          statusCode,
          message: customMessage || 'Không tìm thấy',
          error: 'Not Found'
        });
        break;
      case 500:
        response.status(statusCode).json({
          statusCode,
          message: customMessage || 'Đã xảy ra lỗi máy chủ nội bộ',
          error: 'Internal Server Error'
        });
        break;
      default:
        response.status(statusCode).json(exception.getResponse());
        break;
    }
  }
}
