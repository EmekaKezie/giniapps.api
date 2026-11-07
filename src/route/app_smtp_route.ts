/**
 * SMTP setup for an app. Mounted at /api/app/:app_id/smtp.
 * Console users (JWT) manage SMTP here; the work is done by GiniSend's admin
 * API, which this forwards to with the server-held admin key.
 */
import { Request, Response, Router } from "express";
import { JwtConfig } from "../utils/jwt";
import { ginisendAdminRequest } from "../thirdparty/ginisend/ginisend_admin";

const router = Router({ mergeParams: true });
router.use(JwtConfig);

type TParams = { app_id: string; smtp_id?: string };
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

const forward =
  (method: "GET" | "POST" | "PUT" | "DELETE", suffix: (p: TParams) => string, withBody = false) =>
  async (req: Request<TParams>, res: Response) => {
    const { app_id, smtp_id } = req.params;
    if (!ID_RE.test(app_id) || (smtp_id !== undefined && !ID_RE.test(smtp_id))) {
      res.status(400).json({ status: "failed", message: "Invalid id", data: null });
      return;
    }
    const { httpStatus, body } = await ginisendAdminRequest(
      method,
      `/apps/${encodeURIComponent(app_id)}/smtp${suffix(req.params)}`,
      { body: withBody ? (req.body ?? {}) : undefined, actorUserId: req.token?.user_id },
    );
    res.status(httpStatus).json(body);
  };

const id = (p: TParams) => encodeURIComponent(p.smtp_id!);

router.get("/", forward("GET", () => ""));
router.get("/available", forward("GET", () => "/available"));
router.post("/", forward("POST", () => "", true));
router.post("/:smtp_id/assign", forward("POST", (p) => `/${id(p)}/assign`, true));
router.put("/:smtp_id", forward("PUT", (p) => `/${id(p)}`, true));
router.put("/:smtp_id/default", forward("PUT", (p) => `/${id(p)}/default`));
router.put("/:smtp_id/status", forward("PUT", (p) => `/${id(p)}/status`, true));
router.delete("/:smtp_id", forward("DELETE", (p) => `/${id(p)}`));
router.post("/:smtp_id/verify", forward("POST", (p) => `/${id(p)}/verify`, true));

export default router;
