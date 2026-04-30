import { Request, Response, Router } from "express";
import { IApiRes } from "../model/aapbase_model";
import { IAppContext } from "../context/app_context";
import { CreateApp, GetAppByCode, GetAppById, GetApps } from "../repo/app_repo";
import { JwtConfig } from "../utils/jwt";
import { CreateAppRequest } from "../model/app_model";
import { v4 as UUID } from "uuid";

const router = Router();

//#region Get all apps
router.get(
  "/",
  JwtConfig,
  async (req, res: Response<IApiRes<IAppContext[]>>) => {
    let response: IApiRes<IAppContext[]>;
    try {
      const apps = await GetApps();
      response = {
        status: "success",
        message: "Success",
        data: apps,
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

//#region get app by id
router.get(
  "/:app_id/get_id",
  JwtConfig,
  async (
    req: Request<{ app_id: string }>,
    res: Response<IApiRes<IAppContext | null>>,
  ) => {
    let response: IApiRes<IAppContext | null>;
    try {
      const { app_id } = req.params;
      const app = await GetAppById(app_id);

      if (!app) {
        response = {
          status: "failed",
          message: "App not found",
          data: null,
        };
        res.status(401).json(response);
        return;
      }

      response = {
        status: "success",
        message: "Success",
        data: app,
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

//#region Get app by code
router.get(
  "/:app_code/get_code",
  JwtConfig,
  async (
    req: Request<{ app_code: string }>,
    res: Response<IApiRes<IAppContext | null>>,
  ) => {
    let response: IApiRes<IAppContext | null>;
    try {
      const { app_code } = req.params;
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

      response = {
        status: "success",
        message: "Success",
        data: app,
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

//#region Create app
router.post(
  "/create",
  JwtConfig,
  async (
    req: Request<{}, {}, CreateAppRequest, {}>,
    res: Response<IApiRes<string>>,
  ) => {
    let response: IApiRes<string>;
    const token = req.token!;

    try {
      const app_name = req.body?.app_name?.trim();
      const app_code = req.body?.app_code?.trim();
      const app_logo = req.body?.app_logo;
      const authorized_urls = req.body?.authorized_urls || [];
      const is_active = !req.body?.is_active ? 0 : 1;
      const is_live = !req.body?.is_live ? 0 : 1;

      if (!app_name) {
        response = {
          status: "failed",
          message: "App name is required",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      if (!app_code) {
        response = {
          status: "failed",
          message: "App code is required",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const app_exists = await GetAppByCode(app_code);
      if (app_exists) {
        response = {
          status: "failed",
          message: "App Aready exists",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const app_ctx: IAppContext = {
        app_id: UUID(),
        app_name,
        app_code,
        api_key: UUID(),
        is_active,
        is_live,
        created_date: new Date(),
        creator_user_id: token.user_id,
        license_private_key: null,
        license_public_key: null,
        generated_license: null,
        authorized_urls: authorized_urls?.join(","),
        app_logo: app_logo,
        oauth_client_id: UUID(),
        oauth_client_secret: UUID(),
        modified_date: new Date(),
        modifier_user_id: token.user_id,
      };

      const created = await CreateApp(app_ctx);
      if (!created) {
        response = {
          status: "failed",
          message: "App creation failed. Please try again",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      response = {
        status: "success",
        message: "App created successfully",
        data: "Success",
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
