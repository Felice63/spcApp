// Vercel serverless function to proxy OpenRouteService routing requests securely
// Updated to include environment variable debugging - v3 (force redeploy)
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const ORS_API_KEY = process.env.ORS_API_KEY;
    if (!ORS_API_KEY) {
      console.error('ORS_API_KEY not found in environment variables');
      res.status(500).json({ error: 'ORS API key not set in environment variables' });
      return;
    }

    console.log('Request body:', req.body);

    // Accept coordinates from frontend and ensure [lng, lat] order
    const profile = req.body.profile || 'driving-car';
    let coordinates = req.body.coordinates;
    
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      console.error('Invalid coordinates:', coordinates);
      res.status(400).json({ error: 'Invalid coordinates' });
      return;
    }

    console.log('Original coordinates:', coordinates);

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

    console.log('Processed coordinates:', coordinates);

    const orsUrl = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
    const orsRes = await axios.post(
      orsUrl,
      { coordinates },
      {
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('ORS response status:', orsRes.status);
    res.status(200).json(orsRes.data);
  } catch (err) {
    console.error('Full error:', err);
    console.error('ORS error:', err.response?.data || err.message);
    res.status(500).json({ 
      error: 'ORS routing failed', 
      details: err.response?.data || err.message,
      stack: err.stack
    });
  }
};
