import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./database.js";

// Importar rutas
import userRoutes from "./routes/user.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.routes.js";
import seedRoutes from "./routes/seed.routes.js";
import setupSwagger from "./swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // Para entender JSON en el body
app.use(cookieParser(process.env.JWT_REFRESH_SECRET || "refresh_secret"));

// Conectar DB
connectDB();

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/seed", seedRoutes);
// Swagger UI
setupSwagger(app);

// Global error handler (debe ir después de las rutas)
app.use(errorHandler);

// Export app for tests and start server only if run directly
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;
