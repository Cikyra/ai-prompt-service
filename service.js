import express from "express";
import OpenAI from "openai";


const app = express();
app.use(express.json());
const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey,
});

const withTimeout = (promise, ms) =>
    Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s`)), ms)
        ),
    ]);

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    //TODO: Validate the prompt
    console.log("[generate] Request received, prompt:", prompt?.slice(0, 80));

    let classification;
    try {
        const textOrImage = await withTimeout(
            openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages:[
                    {
                        role: "system",
                        content: "Classify the user prompt as either text or image. Respond with 'TEXT' or 'IMAGE' only.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            }),
            5000
        );
        classification = textOrImage.choices[0].message.content.trim().toUpperCase();
    } catch (err) {
        console.error("[generate] Classification failed:", err.message);
        return res.status(500).json({ error: "Classification failed: " + err.message });
    }

    console.log("[generate] Classified as:", classification);

    if(classification === "IMAGE") {
        try {
            const imageResponse = await withTimeout(
                openai.images.generate({
                    model: "gpt-image-2",
                    prompt: prompt,
                    size: "1024x1024",
                }),
                35000
            );
            console.log("[generate] Image generation succeeded");
            return res.json({ response: imageResponse.data[0].b64_json });
        } catch (err) {
            console.error("[generate] Image generation failed:", err.message);
            return res.status(500).json({ error: "Image generation failed: " + err.message });
        }
    } else {
        try {
            const completion = await withTimeout(
                openai.chat.completions.create({
                    model: "gpt-4.1",
                    messages:[
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                }),
                5000
            );
            return res.json({ response: completion.choices[0].message.content });
        } catch (err) {
            console.error("[generate] Text generation failed:", err.message);
            return res.status(500).json({ error: "Text generation failed: " + err.message });
        }
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});

