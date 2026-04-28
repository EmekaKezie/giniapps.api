import { Request, Response, Router } from "express";
import { ILoginReq, ILoginRes } from "../model/auth_model";
import { IApiRes, ITokenClaims } from "../model/aapbase_model";
import { GetAccountByUserId } from "../repo/account_repo";
import { EncodeAuthToken, JwtConfig } from "../utils/jwt";

const router = Router();

//#region Login
router.post(
  "/login",
  async (
    req: Request<{}, {}, ILoginReq, {}>,
    res: Response<IApiRes<ILoginRes | null>>,
  ) => {
    let response: IApiRes<ILoginRes | null>;

    try {
      const user_id = req.body.user_id?.trim();

      if (!user_id) {
        response = {
          status: "failed",
          message: "User id is required",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const account = await GetAccountByUserId(user_id);
      if (!account) {
        response = {
          status: "failed",
          message: "Invalid credentials",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      if (!account) {
        response = {
          status: "failed",
          message: "Something went wrong",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const generate_token = EncodeAuthToken(
        user_id,
        account.account_id,
        account.email,
        account.firstname || "",
        account.lastname || "",
      );

      const login_res: ILoginRes = {
        token: generate_token,
        ...account,
      };

      response = {
        status: "success",
        message: "Successful login",
        data: login_res,
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

//#region Get protected
router.get(
  "/protected",
  JwtConfig,
  async (req: Request, res: Response<IApiRes<ITokenClaims | null>>) => {
    let response: IApiRes<ITokenClaims | null>;
    const token = req.token;
    try {
      response = {
        status: "success",
        message: "Success",
        data: token!,
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
