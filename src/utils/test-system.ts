import crypto from "node:crypto";

const MOCK_PRIVATE = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEINTiSNDp709I67K85O6sFv7qN8984H1V5v3z6z8l8z8u
-----END PRIVATE KEY-----`;

const MOCK_PUBLIC = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA9F5X7k5P8p8z8X9v3z6z8l8z8u7qN8984H1V5v3z6z8=
-----END PUBLIC KEY-----`;

// --- SIMULATE GENERATOR ---
const info = { userId: "123", plan: "pro", expiry: "2026-05-27T09:06:04.711Z" };
const infoString = JSON.stringify(info);
const sig = crypto.sign(
  null,
  Buffer.from(infoString),
  crypto.createPrivateKey(MOCK_PRIVATE),
);
const licenseString = Buffer.from(
  JSON.stringify({ infoString, sig: sig.toString("base64") }),
).toString("base64");

console.log("1. Generated License String length:", licenseString.length);

// --- SIMULATE VALIDATOR ---
const decoded = JSON.parse(Buffer.from(licenseString, "base64").toString());
const isValid = crypto.verify(
  null,
  Buffer.from(decoded.infoString),
  crypto.createPublicKey(MOCK_PUBLIC),
  Buffer.from(decoded.sig, "base64"),
);

console.log("2. Is logic valid internally?", isValid);
