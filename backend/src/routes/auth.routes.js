import { Router } from "express";
import { body, check } from "express-validator";
import { register, login, refresh } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/register",
  [
    body("username").isString().isLength({ min: 3 }),
    body("email").isEmail(),
    body("nombre").optional().isString(),
    body("apellido").optional().isString(),
    body("password").isString().isLength({ min: 6 }),
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    body("email").optional().isEmail(),
    body("username").optional().isString().isLength({ min: 1 }),
    body("password").isString().notEmpty(),
    // ensure at least email or username is provided
    check().custom((_, { req }) => {
      if (!req.body.email && !req.body.username)
        throw new Error("email or username required");
      return true;
    }),
  ],
  validateRequest,
  login
);

export default router;

// Endpoint para refresh token
router.post("/refresh", refresh);
