import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
const apiKey = process.env.OPENAI_API_KEY;

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    //TODO: Validate the prompt
    

    const openai = new OpenAI({
    apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages:[
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    res.json({ response: completion.choices[0].message.content });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});

