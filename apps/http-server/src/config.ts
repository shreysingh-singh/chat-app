import * as dotenv from "dotenv";
import path from "path";

// Load the .env file located in the package root (apps/http-server/.env)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const PORT_URL: number = process.env.PORT_URL
  ? Number(process.env.PORT_URL)
  : 3001;
export const MONGO_URL: string = process.env.MONGO_URL || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
