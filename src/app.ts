import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import auth_route from "./route/auth_route";
import app_route from "./route/app_route";
import license_routes from "./route/license_route";


const app = express();

// CORS Setup
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/api/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/auth", auth_route);
app.use("/api/app", app_route)
app.use("/api/license", license_routes);



export default app;
