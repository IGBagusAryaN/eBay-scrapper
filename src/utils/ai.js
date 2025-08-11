import axios from "axios";
import extractJSON from "./extractJSON.js";

export async function generateSummaryWithAI(title, description) {
  if (!process.env.OPENROUTER_API_KEY) return "";

  try {
    const prompt = `Create a brief summary (max 2 sentences) of the following data:
Product Name: ${title}
Description: ${description}
Use natural and informative language.`;

    const aiRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return aiRes.data.choices[0]?.message?.content?.trim() || "";
  } catch (err) {
    console.error("Summary AI Error:", err.response?.data || err.message);
    return "";
  }
}

export async function cleanWithAI(data) {
  if (!process.env.OPENROUTER_API_KEY) return data;

  try {
    const prompt = `Bersihkan teks pada setiap field di JSON berikut (jangan ubah struktur atau hapus field):
${JSON.stringify(data, null, 2)}`;

    const aiRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let output = aiRes.data.choices[0]?.message?.content?.trim() || "";
    output = output
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();
    output = extractJSON(output);

    return JSON.parse(output);
  } catch (err) {
    console.error("AI Clean Error:", err.response?.data || err.message);
    return data;
  }
}
