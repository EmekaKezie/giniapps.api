import { IAccountContext } from "./account_context";

export interface ICompanyContext {
  company_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
  website?: string | null;
  tax_no?: string | null;
  created_date: Date;
  creator_user_id: string;
  modified_date: Date;
  modifier_user_id: string;
  country_code?: string | null;

  // RELATION: Array of users who have access to this company
  accounts?: IAccountContext[];
}
