// utils/licenseValidator.ts
import crypto from "node:crypto";
import { licenseKeyFormat } from "./licenseKeyFormat";

const PUBLIC_KEY = licenseKeyFormat(process.env.LICENSE_PUBLIC_KEY!);

export const licenseValidator = (license: string): boolean => {
  try {
    const decoded = JSON.parse(
      Buffer.from(license.trim(), "base64").toString("utf-8"),
    );

    const { payload, sig } = decoded;

    if (!payload || !sig) return false;

    return crypto.verify(
      null,
      Buffer.from(payload),
      crypto.createPublicKey(PUBLIC_KEY),
      Buffer.from(sig, "base64"),
    );
  } catch {
    return false;
  }
};

export const getLicenseData = (license: string) => {
  try {
    const decoded = JSON.parse(
      Buffer.from(license, "base64").toString("utf-8"),
    );

    // console.log(decoded)

    return JSON.parse(decoded.payload);
  } catch {
    return null;
  }
};
