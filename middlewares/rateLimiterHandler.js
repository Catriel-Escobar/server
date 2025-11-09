import rateLimit from "express-rate-limit";
import { createAppError } from "../utils/createAppError.js";

export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      createAppError(
        429,
        "Too many login attempts, please try again later",
        "ratelimit",
      ),
    );
  },
  skipSuccessfulRequests: true,
});
