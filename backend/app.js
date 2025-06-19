import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import profileRoutes from "./routes/profile.routes.js" 

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: "https://vercell-jagadompet.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);             // untuk login, register, logout, refresh token
app.use("/api/users", profileRoutes);         // untuk profil user: detail, update, session
app.use("/api/transactions", transactionRoutes); // untuk transaksi: buat, baca, edit, hapus
app.use("/api/dashboard", dashboardRoutes);   // untuk ringkasan statistik, chart, dsb

export default app;
