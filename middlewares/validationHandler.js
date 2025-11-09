import { ZodError } from "zod";
import { createAppError } from "../utils/createAppError.js";

export const validateSchema =
  (schema, type = "body") =>
  (req, res, next) => {
    try {
      schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => {
          const field = err.path.join(".");
          const capitalizedField =
            field.charAt(0).toUpperCase() + field.slice(1);
          return {
            type: "validation",
            message: `${capitalizedField}: ${err.message}`,
          };
        });

        return next(
          createAppError(
            400,
            "Validation Error",
            "validation",
            formattedErrors,
          ),
        );
      }

      return next(createAppError(500, error.message));
    }
  };
