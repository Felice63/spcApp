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
    const { coordinates, profile = 'driving-car' } = req.body;
    const orsUrl = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
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
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Local ORS proxy running on port ${PORT}`));
