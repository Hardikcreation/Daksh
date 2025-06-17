import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { config } from "../config/keys.js"
dotenv.config();

export const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "1d" });
};


