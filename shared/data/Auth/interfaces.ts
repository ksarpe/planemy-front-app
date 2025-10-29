import type { User } from "../User/interfaces";

export interface AuthContextType {
  user: User | null; //TODO: replace with User type from backend
  loading: boolean;
  refetchUser: () => Promise<unknown>;
}

// API request/response interfaces (moved from src/api/auth.ts)
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

// Component interfaces
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export class APIError extends Error {
  status: number;
  body: any;

  constructor(message: string, status: number, body: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.body = body;
  }
}
