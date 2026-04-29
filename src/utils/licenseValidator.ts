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

    // 1. Verify cryptographic integrity (Is the signature valid?)
    const isAuthentic = crypto.verify(
      null,
      Buffer.from(payload),
      crypto.createPublicKey(PUBLIC_KEY),
      Buffer.from(sig, "base64"),
    );

    if (!isAuthentic) return false;

    // 2. Verify Expiry (Has the date passed?)
    const { expiry } = JSON.parse(payload);

    // Compare numeric timestamps to be 100% accurate
    if (new Date().getTime() > new Date(expiry).getTime()) {
      console.log("License expired at:", expiry);
      return false; // Signature was real, but time has run out
    }

    return true;
  } catch (error) {
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
