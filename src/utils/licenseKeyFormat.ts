// utils/keys.ts
export const licenseKeyFormat = (key: string) => {
  return key.replace(/\\n/g, "\n").trim();
};
