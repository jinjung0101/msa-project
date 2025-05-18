import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ZodSchema, ZodError } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}
  transform(value: any): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(result.error.format());

    }
    return result.data;
  }
}

