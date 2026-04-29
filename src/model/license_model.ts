export interface IGenerateLicenseRequest {
  app_code: string;
  valid_days: number;
  is_permanent: boolean;
}

export interface IGenerateLicenseResponse {
  license: string;
}

export interface IVerifyLicenseRequest {
  license: string;
}

export interface IVerifyLicenseResponse {
  is_valid: boolean;
}

export interface IInspectLicenseRequest {
  license: string;
}

export interface IInspectLicenseResponse {
  app_code: string;
  expiry: string;
}
