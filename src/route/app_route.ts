import { Request, Response, Router } from "express";
import { IApiRes } from "../model/aapbase_model";
import { IAppContext } from "../context/app_context";
import { GetAppByCode, GetAppById, GetApps } from "../repo/app_repo";

const router = Router();

router.get("/", async (req, res: Response<IApiRes<IAppContext[]>>) => {
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
});

router.get(
  "/:app_id/get_id",
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

router.get(
  "/:app_code/get_code",
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




export default router;
