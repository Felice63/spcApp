// Local Express proxy for OpenRouteService routing
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ORS_API_KEY = process.env.ORS_API_KEY;

app.post('/api/route', async (req, res) => {
  try {
    // Accept coordinates from frontend and ensure [lng, lat] order
    const profile = req.body.profile || 'driving-car';
    let coordinates = req.body.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }
    // If coordinates are [lat, lng], swap to [lng, lat]
    coordinates = coordinates.map(coord => {
      if (Array.isArray(coord) && coord.length === 2) {
        // If latitude is in the range of Toronto, swap
        if (coord[0] > 40 && coord[0] < 45 && coord[1] < -70 && coord[1] > -90) {
          return [coord[1], coord[0]];
        }
        // If already [lng, lat], leave as is
        return coord;
      }
      throw new Error('Invalid coordinate format');
    });
    const orsUrl = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
    try {
      const response = await axios.post(
        orsUrl,
        { coordinates },
        {
          headers: {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('ORS error:', error.response?.data || error.message);
      res.status(500).json({ error: 'ORS routing failed', details: error.response?.data || error.message });
    }
  } catch (err) {
    // Log detailed error info to the terminal
    console.error('ORS Proxy Error:', err.response ? err.response.data : err);
    res.status(500).json({ error: err.toString(), ors: err.response ? err.response.data : undefined });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Local ORS proxy running on port ${PORT}`));
