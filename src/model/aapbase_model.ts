declare global {
  namespace Express {
    interface Request {
      token?: ITokenClaims; // Here we add the `user` property to `req` to store the token claims
    }
  }
}

export interface ITokenClaims {
  user_id: string;
  account_id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface IApiRes<T> {
  status:
    | "success"
    | "failed"
    | "error"
    | "invalid_token"
    | "permission_denied"
    | "failed_show_errors"
    | "signup_account_exists";
  message: string;
  data: T | null;
  total?: number;
  errors?: string[];
}
