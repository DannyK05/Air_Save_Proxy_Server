const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

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

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
