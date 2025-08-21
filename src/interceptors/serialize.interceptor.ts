import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDto } from "src/users/dtos/user-dto";

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // run something before a request is handled by the rquest handler
        console.log('im running before the handler',context);

        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(UserDto, data), {
                    excludeExtraneousValues: true,
                }
            })
        )
    }
}