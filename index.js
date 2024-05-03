const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Load the Gemini model

const app = express();
const port = process.env.PORT || 3000; // Use port from environment or default to 3000

// Enable JSON body parsing
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

// Proxy endpoint

//Google air quality API endpoint 
app.get('/aqi', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        const response = await axios.get(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.AQI_API_KEY}`, {
            params: {
                location: {
                    latitude,
                    longitude
                }
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).send('Failed to fetch AQI data');
    }
});
 //Google Gemini API endpoint
 const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
 const model = genAI.getGenerativeModel({ model: "gemini-pro"});

 app.get("/gemini", async (req, res) => {
    try{
    const {prompt} = req.query;
    async function run() {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text ? await response.text() : "No text returned";
        res.send(text);
        console.log(text);
      }
      run();
    }
    catch(error){
        console.error('API request failed:', error);
        res.status(500).send('Failed to fetch AQI data').json({ error: 'Failed to generate content', details: error.message });
    }
 }) 
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
