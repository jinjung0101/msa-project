import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  accessToken!: string;

  constructor(init?: Partial<AccessTokenDto>) {
    Object.assign(this, init);
  }
}
