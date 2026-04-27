// utils/keys.ts
export const formatKey = (key: string) => {
  return key.replace(/\\n/g, "\n").trim();
};
