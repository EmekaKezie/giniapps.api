import "dotenv/config";
import { GinisendEmailRequest, GinisendEmailResponse } from "./ginisend_types";

export const giniSendEmail = async (
  req: GinisendEmailRequest,
): Promise<GinisendEmailResponse> => {
  try {
    const baseUrl = process.env.GINISEND_BASE_URL?.trim();
    const apiKey = process.env.GINISEND_API_KEY?.trim();

    if (!baseUrl || !apiKey) {
      return {
        message_id: "",
        recipient: req.to,
        error:
          "GINISEND_BASE_URL and GINISEND_API_KEY must be configured before sending email.",
        status: "error",
      };
    }

    const url = `${baseUrl.replace(/\/$/, "")}/email/send`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    const responseText = await response.text();
    let resData: Record<string, unknown>;
    try {
      resData = JSON.parse(responseText) as Record<string, unknown>;
    } catch {
      resData = { message: responseText };
    }

    if (!response.ok || resData.status !== "success") {
      return {
        message_id: "",
        recipient: req.to,
        error: JSON.stringify(resData),
        status: typeof resData.status === "string" ? resData.status : "error",
      };
    }

    return resData as unknown as GinisendEmailResponse;
  } catch (error) {
    return {
      message_id: "",
      recipient: req.to,
      error: error instanceof Error ? error.message : String(error),
      status: "error",
    };
  }
};

export const giniSendEmailOutbox = async (
  apiKey: string,
  offset: number = 0,
  limit: number = 20,
): Promise<{
  status: "success" | "failed" | "error";
  message?: string;
  data?: any[];
  total?: number;
}> => {
  try {
    const baseUrl = "https://ginisend-api.netlify.app/api/v1";

    if (!baseUrl || !apiKey) {
      return {
        status: "failed",
        message: "invalid",
      };
    }

    const query = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
    });
    const url = `${baseUrl.replace(/\/$/, "")}/email/getall?${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    const responseText = await response.text();
    let resData: any;
    try {
      resData = JSON.parse(responseText);
    } catch {
      resData = { message: responseText };
    }

    if (!response.ok || (resData?.status && resData.status !== "success")) {
      return {
        status: "failed",
        message:
          typeof resData?.message === "string"
            ? resData.message
            : "Failed to retrieve email outbox",
      };
    }

    // Return only the data part of the GiniSend response (plus total for paging)
    const data: any[] = Array.isArray(resData?.data) ? resData.data : [];

    return {
      status: "success",
      data,
      total: typeof resData?.total === "number" ? resData.total : data.length,
    };
  } catch (error) {
    console.error("Error fetching email outbox:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
};
