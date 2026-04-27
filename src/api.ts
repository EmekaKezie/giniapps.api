import serverless from "serverless-http";
import app from "./app";

// Netlify looks for the 'handler' export
export const handler = serverless(app);