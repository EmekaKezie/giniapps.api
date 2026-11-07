/**
 * SMTP setup for an app. Mounted at /api/app/:app_id/smtp.
 * Console users (JWT) manage SMTP here. The app's API key is looked up from
 * app_id and sent to GiniSend as x-api-key, like the email outbox route.
 */
import { Request, Response, Router } from "express";
import { JwtConfig } from "../utils/jwt";
import { GetAppById } from "../repo/app_repo";
import { ginisendSmtpRequest } from "../thirdparty/ginisend/ginisend_smtp";

const router = Router({ mergeParams: true });
router.use(JwtConfig);

type TParams = { app_id: string; smtp_id?: string };
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

const forward =
  (method: "GET" | "POST" | "PUT" | "DELETE", suffix: (p: TParams) => string, withBody = false) =>
  async (req: Request<TParams>, res: Response) => {
    try {
      const { app_id, smtp_id } = req.params;
      if (smtp_id !== undefined && !ID_RE.test(smtp_id)) {
        res.status(400).json({ status: "failed", message: "Invalid SMTP id", data: null });
        return;
      }

      const app = await GetAppById(app_id);
      if (!app) {
        res.status(404).json({ status: "failed", message: "App not found", data: null });
        return;
      }
      if (!app.api_key) {
        res.status(400).json({ status: "failed", message: "App API key not found", data: null });
        return;
      }

      // Record which console user made the change.
      const body = withBody
        ? { ...(req.body ?? {}), actor_user_id: req.token?.user_id }
        : method === "GET"
          ? undefined
          : { actor_user_id: req.token?.user_id };

      const { httpStatus, body: result } = await ginisendSmtpRequest(app.api_key, method, suffix(req.params), body);
      res.status(httpStatus).json(result);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        data: null,
      });
    }
  };

const id = (p: TParams) => `/${encodeURIComponent(p.smtp_id!)}`;

router.get("/", forward("GET", () => ""));
router.get("/available", forward("GET", () => "/available"));
router.post("/", forward("POST", () => "", true));
router.post("/:smtp_id/assign", forward("POST", (p) => `${id(p)}/assign`, true));
router.put("/:smtp_id", forward("PUT", (p) => id(p), true));
router.put("/:smtp_id/default", forward("PUT", (p) => `${id(p)}/default`));
router.put("/:smtp_id/status", forward("PUT", (p) => `${id(p)}/status`, true));
router.delete("/:smtp_id", forward("DELETE", (p) => id(p)));
router.post("/:smtp_id/verify", forward("POST", (p) => `${id(p)}/verify`, true));

export default router;
