import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export abstract class BaseProxyService {
  constructor(
    protected readonly http: HttpService,
    private readonly baseUrl: string
  ) {}

  protected async get<TResponse>(path: string, token: string): Promise<TResponse> {
    const resp = await firstValueFrom(
      this.http.get<TResponse>(`${this.baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return resp.data;
  }

  protected async post<TResponse, TRequest>(path: string, body: TRequest, token: string  ): Promise<TResponse> {
    const resp = await firstValueFrom(
      this.http.post<TResponse>(`${this.baseUrl}${path}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return resp.data;
  }

  protected async put<TResponse, TRequest>(
    path: string,
    body: TRequest,
    token: string
  ): Promise<TResponse> {
   const resp = await firstValueFrom(
      this.http.put<TResponse>(`${this.baseUrl}${path}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return resp.data;
  }

  protected async patch<TResponse, TRequest>(
    path: string,
    body: TRequest,
    token: string
  ): Promise<TResponse> {
    const resp = await firstValueFrom(
      this.http.patch<TResponse>(`${this.baseUrl}${path}`, body, {
       headers: { Authorization: `Bearer ${token}` },
      })
    );
    return resp.data;
  }

  protected async delete<TResponse>(
    path: string,
    token: string
  ): Promise<TResponse> {
    const resp = await firstValueFrom(
      this.http.delete<TResponse>(`${this.baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return resp.data;
  }
}
