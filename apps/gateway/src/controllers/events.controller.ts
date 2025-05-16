import { Controller, Get, Req } from "@nestjs/common";

import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Controller("events")
export class EventsController {
  constructor(private readonly http: HttpService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const url = `${process.env.EVENT_SERVICE_URL}/events`;
    const resp = await firstValueFrom(
      this.http.get(url, {
        headers: { authorization: req.headers.authorization },
      })
    );
    return resp.data;
  }
}
