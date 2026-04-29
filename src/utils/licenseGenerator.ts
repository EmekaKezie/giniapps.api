// utils/licenseGenerator.ts
import crypto from "node:crypto";
import { licenseKeyFormat } from "./licenseKeyFormat";

// const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");

// console.log(privateKey.export({ format: "pem", type: "pkcs8" }));
// console.log(publicKey.export({ format: "pem", type: "spki" }));

const PRIVATE_KEY = licenseKeyFormat(process.env.LICENSE_PRIVATE_KEY!);

export const licenseGenerator2 = (
  userId: string,
  plan: string,
  days: number,
): string => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);

  const payload = {
    userId,
    plan,
    expiry: expiry.toISOString(),
  };

  const payloadString = JSON.stringify(payload);

  const signature = crypto.sign(
    null,
    Buffer.from(payloadString),
    crypto.createPrivateKey(PRIVATE_KEY),
  );

  const licensePacket = {
    payload: payloadString,
    sig: signature.toString("base64"),
  };

  return Buffer.from(JSON.stringify(licensePacket)).toString("base64");
};

export const licenseGenerator = (
  app_code: string,
  valid_days: number,
  is_permanent: boolean,
): string => {
  const expiry = new Date();

  if (is_permanent) {
    expiry.setFullYear(9999);
  } else {
    expiry.setDate(expiry.getDate() + valid_days);
  }

  const payload = {
    app_code,
    expiry: expiry.toISOString(),
  };

  const payloadString = JSON.stringify(payload);

  const signature = crypto.sign(
    null,
    Buffer.from(payloadString),
    crypto.createPrivateKey(PRIVATE_KEY),
  );

  const licensePacket = {
    payload: payloadString,
    sig: signature.toString("base64"),
  };

  return Buffer.from(JSON.stringify(licensePacket)).toString("base64");
};
