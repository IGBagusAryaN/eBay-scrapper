import express from "express";
import pLimit from "p-limit";
import scrapeEbayPage from "../scraper/scrapeEbayPage.js";
import { cleanWithAI } from "../utils/ai.js";

const router = express.Router();
const limit = pLimit(3);

router.get("/", async (req, res) => {
  try {
    const query = req.query.q || "nike";
    const pages = parseInt(req.query.pages) || 1;

    const tasks = [];
    for (let i = 1; i <= pages; i++) {
      tasks.push(limit(() => scrapeEbayPage(query, i).then(data => ({ page: i, data }))));
    }

    let allResults = (await Promise.all(tasks))
      .sort((a, b) => a.page - b.page)
      .flatMap(r => r.data);

    allResults = allResults.filter(
      (item, idx, arr) => idx === arr.findIndex(x => x.link === item.link)
    );

    const finalData = await cleanWithAI(allResults);

    res.json({ status: "success", data: finalData });
  } catch (err) {
    console.error("Scrape error:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
