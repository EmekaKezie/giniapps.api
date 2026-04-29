import { Request, Response, Router } from "express";
import { licenseGenerator } from "../utils/licenseGenerator";
import { getLicenseData, licenseValidator } from "../utils/licenseValidator";
import {
  IGenerateLicenseRequest,
  IGenerateLicenseResponse,
  IInspectLicenseRequest,
  IInspectLicenseResponse,
  IVerifyLicenseRequest,
  IVerifyLicenseResponse,
} from "../model/license_model";
import { IApiRes } from "../model/aapbase_model";
import { GenerateAppLicense, GetAppByCode } from "../repo/app_repo";
import { IAppContext } from "../context/app_context";
import { v4 as UUID } from "uuid";
import { JwtConfig } from "../utils/jwt";

const router = Router();

//#region Generate license
router.post(
  "/generate",
  JwtConfig,
  async (
    req: Request<{}, {}, IGenerateLicenseRequest, {}>,
    res: Response<IApiRes<IGenerateLicenseResponse>>,
  ) => {
    let response: IApiRes<IGenerateLicenseResponse>;

    try {
      const { app_code, valid_days } = req.body;

      if (!app_code) {
        response = {
          status: "failed",
          message: "App Code is required",
          data: null,
        };
        res.status(400).json(response);
        return;
      }
      const app = await GetAppByCode(app_code);
      if (!app) {
        response = {
          status: "failed",
          message: "App not found",
          data: null,
        };
        res.status(401).json(response);
        return;
      }

      const license = licenseGenerator(app_code, valid_days);

      const created = await GenerateAppLicense(app.app_id, license);
      if (!created) {
        response = {
          status: "failed",
          message: "Failed to generate license",
          data: null,
        };
      }

      response = {
        status: "success",
        message: "Success",
        data: {
          license: license,
        },
      };
      res.status(200).json(response);
      return;
    } catch (error) {
      const errMsg = error instanceof Error ? error?.message : "Unknown error";
      response = {
        status: "error",
        message: errMsg,
        data: null,
      };
      res.status(500).json(response);
      return;
    }
  },
);
//#endregion

//#region Verify license
router.post(
  "/verify",
  JwtConfig,
  (
    req: Request<{}, {}, IVerifyLicenseRequest, {}>,
    res: Response<IApiRes<IVerifyLicenseResponse>>,
  ) => {
    let response: IApiRes<IVerifyLicenseResponse>;

    try {
      const { license } = req.body;
      const is_valid = licenseValidator(license);

      if (!is_valid) {
        response = {
          status: "failed",
          message: "License is invalid",
          data: {
            is_valid: is_valid,
          },
        };
        res.status(400).json(response);
        return;
      }

      response = {
        status: "success",
        message: "Success",
        data: {
          is_valid: is_valid,
        },
      };
      res.status(200).json(response);
      return;
    } catch (error) {
      const errMsg = error instanceof Error ? error?.message : "Unknown error";
      response = {
        status: "error",
        message: errMsg,
        data: null,
      };
      res.status(500).json(response);
      return;
    }
  },
);
//#endregion

//#region Inspect license
router.post(
  "/inspect",
  JwtConfig,
  async (
    req: Request<{}, {}, IInspectLicenseRequest, {}>,
    res: Response<IApiRes<IInspectLicenseResponse | null>>,
  ) => {
    let response: IApiRes<IInspectLicenseResponse | null>;
    try {
      const { license } = req.body;

      const is_valid = licenseValidator(license);
      if (!is_valid) {
        response = {
          status: "failed",
          message: "Invalid License",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const data = getLicenseData(license);
      response = {
        status: "success",
        message: "License is valid",
        data: {
          app_code: data.app_code,
          expiry: data.expiry,
        },
      };
      res.status(200).json(response);
      return;
    } catch (error) {
      const errMsg = error instanceof Error ? error?.message : "Unknown error";
      response = {
        status: "error",
        message: errMsg,
        data: null,
      };
      res.status(500).json(response);
      return;
    }
  },
);
//#endregion

export default router;
