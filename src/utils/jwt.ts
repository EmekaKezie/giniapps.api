import { Request, Response, NextFunction } from "express"; // Ensure these are from express
import { IApiRes, ITokenClaims } from "../model/aapbase_model";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

const secret = "123456";

export const EncodeAuthToken = (
  user_id: string,
  account_id: string,
  email: string,
  firstname: string,
  lastname: string,
): string => {
  const payload: ITokenClaims = {
    user_id,
    account_id,
    email,
    firstname,
    lastname,
  };

  const token: string = jwt.sign(payload, secret, {
    expiresIn: "24h",
  });

  return token;
};

export const JwtConfig = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    const response: IApiRes<null> = {
      status: "invalid_token",
      message: "Invalid session. Please login",
      data: null,
    };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    secret,
    (err: VerifyErrors | null, decode: string | JwtPayload | undefined) => {
      if (err) {
        const response: IApiRes<null> = {
          status: "invalid_token",
          message: "Your session has expired. Please login to continue.",
          data: null,
        };
        res.status(401).json(response);
        return;
      }

      const payload = decode as ITokenClaims & JwtPayload;

      req.token = {
        user_id: payload.user_id,
        account_id: payload.account_id,
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname,
      };

      next();
    },
  );
};
