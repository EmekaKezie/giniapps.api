import "dotenv/config";

/**
 * Calls GiniSend's SMTP endpoints (/api/v1/smtp...) as an app, using that
 * app's API key in x-api-key (same as the email outbox). Returns GiniSend's
 * HTTP status and JSON body so routes can pass them straight through.
 */
export const ginisendSmtpRequest = async (
  apiKey: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<{ httpStatus: number; body: any }> => {
  const baseUrl = (
    process.env.GINISEND_BASE_URL?.trim() || "https://ginisend-api.netlify.app/api/v1"
  ).replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/smtp${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await response.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      json = { status: "error", message: text || "Unexpected response from GiniSend", data: null };
    }
    return { httpStatus: response.status, body: json };
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
