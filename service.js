import express from "express";
import OpenAI from "openai";


const app = express();
app.use(express.json());
const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey,
});

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    //TODO: Validate the prompt

    const textOrImage = await openai.chat.completions.create({
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
    }); 

    const classification = textOrImage.choices[0].message.content.trim().toUpperCase();

    if(classification === "IMAGE") {
        const imageResponse = await openai.images.generate({
            model: "gpt-image-1.5",
            prompt: prompt,
            size: "1024x1024",
        });
        
        const dataURL = `data:image/png;base64,${imageResponse.data[0].b64_json}`;

        return res.json({response: dataURL});
    }else{
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
        }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});

