const express = require('express');
const { gpt } = require('nayan-server');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000; // Use process.env.PORT for Vercel

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle POST requests
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, content } = req.body; // Extract prompt and content from JSON body

        if (!prompt) {
            return res.status(400).json({ error: 'Missing required parameter: prompt in request body' });
        }
        if (!content) {
            return res.status(400).json({ error: 'Missing required parameter: content in request body' });
        }

        const messages = [
            {
                role: "assistant",
                content: content
            },
            {
                role: "user",
                content: prompt // Use prompt as received from request body
            }
        ]; // Your predefined messages array
        const model = "GPT-4"; // Your predefined model
        const markdown = false; // Your predefined markdown setting

        gpt({
            messages,
            model,
            markdown
        }, (err, data) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Extract only the 'gpt' response from the data object
            const { gpt } = data;

            // Return only the 'gpt' response
            res.json({ gpt });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export your Express app for serverless deployment
module.exports = app;
