import express from "express";
import dotenv from "dotenv";
import scrapeRoutes from "./routes/scrape.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/scrape", scrapeRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
 