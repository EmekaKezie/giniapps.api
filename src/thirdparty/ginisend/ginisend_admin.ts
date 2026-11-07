import "dotenv/config";

/**
 * Calls GiniSend's admin API (/api/v1/admin/...), which manages SMTP for any
 * app. Needs GINISEND_ADMIN_KEY (same value as on GiniSend). Returns GiniSend's
 * HTTP status and JSON body so routes can pass them straight through.
 */
export const ginisendAdminRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  options: { body?: unknown; actorUserId?: string } = {},
): Promise<{ httpStatus: number; body: any }> => {
  const adminKey = process.env.GINISEND_ADMIN_KEY?.trim();
  if (!adminKey) {
    return {
      httpStatus: 503,
      body: {
        status: "error",
        message: "SMTP management is not configured (GINISEND_ADMIN_KEY missing on giniapps API)",
        data: null,
      },
    };
  }

  const baseUrl = (
    process.env.GINISEND_BASE_URL?.trim() || "https://ginisend-api.netlify.app/api/v1"
  ).replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/admin${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
        ...(options.actorUserId && { "x-actor-user-id": options.actorUserId }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    const text = await response.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      body = { status: "error", message: text || "Unexpected response from GiniSend", data: null };
    }
    return { httpStatus: response.status, body };
  } catch (error) {
    return {
      httpStatus: 502,
      body: {
        status: "error",
        message: `Could not reach GiniSend: ${error instanceof Error ? error.message : String(error)}`,
        data: null,
      },
    };
  }
};
