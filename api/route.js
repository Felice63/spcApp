// Vercel serverless function to proxy OpenRouteService routing requests securely
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { coordinates, profile = 'driving-car' } = req.body;
  const ORS_API_KEY = process.env.ORS_API_KEY;

  if (!ORS_API_KEY) {
    res.status(500).json({ error: 'ORS API key not set in environment variables' });
    return;
  }

  try {
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
    res.status(200).json(orsRes.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
};
