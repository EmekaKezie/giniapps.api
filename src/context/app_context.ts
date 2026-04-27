export interface IAppContext {
  app_id: string;
  app_name: string;
  app_code: string;
  api_key?: string | null;

  is_active: number;
  is_live: number;

  created_date?: Date | null;
  create_by?: string | null;

  license_private_key?: string | null;
  license_public_key?: string | null;
  generated_license?: string | null;
}
