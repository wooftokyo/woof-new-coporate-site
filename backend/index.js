import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.post('/api/generate', async (req, res) => {
    const { command } = req.body;
    console.log('Received command:', command);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContentStream(command);

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        let responseData = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            responseData += chunkText;
        }

        res.write(JSON.stringify({ text: responseData }));
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

app.get('/api/generate/stream', (req, res) => {
    // Do nothing, this is just to maintain the connection with the client
});

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});