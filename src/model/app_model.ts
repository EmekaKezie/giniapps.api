export interface CreateAppRequest {
  app_name: string;
  app_code: string;

  is_active: number;
  is_live: number;

  // license_private_key?: string | null;
  // license_public_key?: string | null;
  // generated_license?: string | null;

  authorized_urls: string[];
  app_logo?: string | null;
}
