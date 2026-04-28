import { ICompanyContext } from "./company_context";

export interface IAccountContext {
  account_id: string;
  user_id: string;
  firstname?: string | null;
  lastname?: string | null;
  email: string;
  phone?: string | null;
  account_status: string;
  created_date: Date;
  creator_user_id: string;
  modified_date: Date;
  modifier_user_id: string;
  is_deactivated: number;
  deactivation_reason?: string | null;

  // RELATION: Array of company memberships
}
