// utils/licenseGenerator.ts
import crypto from "node:crypto";
import { formatKey } from "./keys";

// const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");

// console.log(privateKey.export({ format: "pem", type: "pkcs8" }));
// console.log(publicKey.export({ format: "pem", type: "spki" }));

const PRIVATE_KEY = formatKey(process.env.LICENSE_PRIVATE_KEY!);

export const licenseGenerator = (
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
