export interface CreateAppRequest {
  app_name: string;
  app_code: string;

  is_active: boolean;
  is_live: boolean;

  // license_private_key?: string | null;
  // license_public_key?: string | null;
  // generated_license?: string | null;

  authorized_urls: string[];
  app_logo?: string | null;
}
