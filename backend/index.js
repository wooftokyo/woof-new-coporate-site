import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
    const { command } = req.body;
    console.log('Received command:', command);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContentStream(command);

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            res.write(`data: ${chunkText}\n\n`);
        }

        // EventStream の終了を示すデータを送信
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Error during generation:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'An error occurred', details: error.message });
        } else {
            console.error('Error: Headers already sent, cannot send error response.');
        }
    }
});

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});