import express from "express";
import contactRouter from "./routes/contact.route.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:3000",
  "https://nihareeka-redesign.vercel.app",
];

dotenv.config({ path: "./.env" });

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/contact", contactRouter);

app.get("/api/health", (req, res) => res.status(200).end());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
