// DTO para login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  user: any;
}
