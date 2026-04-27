import { IAccountContext } from "../context/account_context";

export interface ILoginReq {
  user_id: string;
}

export interface ILoginRes extends IAccountContext {
  token: string;
}
