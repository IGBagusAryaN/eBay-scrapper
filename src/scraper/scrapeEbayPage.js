import axios from "axios";
import * as cheerio from "cheerio";
import normalizeLink from "../utils/normalizeLink.js";
import scrapeProductDescription from "./scrapeProductDescription.js";
import { generateSummaryWithAI } from "../utils/ai.js";

export default async function scrapeEbayPage(query, pageNum) {
  const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
    query
  )}&_pgn=${pageNum}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);
  // const items = $(".s-item").toArray().slice(0, 10); //limit 10 results
  const items = $(".s-item").toArray();

  const results = [];

  for (const el of items) {
    const title = $(el).find(".s-item__title").text().replace(/\s+/g, " ").trim();
    const price = $(el).find(".s-item__price").text().trim();
    let link = $(el).find(".s-item__link").attr("href");

    if (!title || title.toLowerCase() === "shop on ebay") continue;

    link = normalizeLink(link);

    const description = await scrapeProductDescription(link);
    const summary = await generateSummaryWithAI(title, description);

    results.push({ title, price, link, description, summary });
  }

  return {
    page: pageNum,
    total: results.length,
    data: results
  };
}
