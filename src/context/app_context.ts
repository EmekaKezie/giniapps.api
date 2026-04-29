export interface IAppContext {
  app_id: string;
  app_name: string;
  app_code: string;
  api_key?: string | null;
  is_active: number;
  is_live: number;

  created_date: Date;
  creator_user_id: string;
  modified_date?: Date | null;
  modifier_user_id?: string | null;

  license_private_key?: string | null;
  license_public_key?: string | null;
  generated_license?: string | null;

  authorized_urls?: string | null;
  app_logo?: string | null;
  oauth_client_id?: string | null;
  oauth_client_secret?: string | null;
}
