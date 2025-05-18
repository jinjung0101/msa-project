import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export abstract class BaseProxyService {
  constructor(
    protected readonly http: HttpService,
    private readonly baseUrl: string
  ) {}

  protected async get<T>(path: string, token: string): Promise<T> {
    const resp = await firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${path}`, {
        headers: { Authorization: token },
      })
    );
    return resp.data;
  }

  
  protected async post<T, U>(
    path: string,
    body: U,
    token: string
  ): Promise<T> {
    const resp = await firstValueFrom(
      this.http.post<T>(`${this.baseUrl}${path}`, body, {
        headers: { Authorization: token },
      })
    );
    return resp.data;
  }

  // 필요시 put, delete 메서드도 동일 패턴으로 추가 예정
}
