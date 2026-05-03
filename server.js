/**
 * Travel Agent Server
 * WhatsApp interface for flight, hotel, weather, alerts, and travel planning
 */

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const WHATSAPP_API = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
const PORT = process.env.PORT || 3000;

// Travel Agent Routes
app.post('/webhook', (req, res) => {
  const message = req.body.message || {};
  const sender = req.body.from;

  console.log(`[${new Date().toISOString()}] Message from ${sender}: ${message.text}`);

  // Route commands
  const text = message.text.toLowerCase();
  
  if (text.includes('/flight')) {
    handleFlightSearch(sender, message);
  } else if (text.includes('/hotel')) {
    handleHotelSearch(sender, message);
  } else if (text.includes('/weather')) {
    handleWeather(sender, message);
  } else if (text.includes('/alerts')) {
    handleAlerts(sender, message);
  } else if (text.includes('/market')) {
    handleMarketOracle(sender, message);
  } else if (text.includes('/itinerary')) {
    handleItinerary(sender, message);
  } else {
    sendMessage(sender, 'Available commands:\n/flight - Search flights\n/hotel - Search hotels\n/weather - Get weather\n/alerts - Travel alerts\n/market - Market predictions\n/itinerary - Manage itinerary');
  }

  res.json({ status: 'ok' });
});

async function handleFlightSearch(sender, message) {
  sendMessage(sender, '✈️ Flight search coming soon! Integrating Google Flights, Skyscanner, Kayak, Amadeus...');
}

async function handleHotelSearch(sender, message) {
  sendMessage(sender, '🏨 Hotel search coming soon! Integrating Booking.com, Airbnb, Hotels.com...');
}

async function handleWeather(sender, message) {
  sendMessage(sender, '🌤️ Weather forecast coming soon! Integrating OpenWeather, Weather API...');
}

async function handleAlerts(sender, message) {
  sendMessage(sender, '🚨 Travel alerts coming soon! News API, Natural disaster alerts, Crowd density...');
}

async function handleMarketOracle(sender, message) {
  sendMessage(sender, '📊 Market oracle coming soon! Price predictions, Travel opportunity alerts...');
}

async function handleItinerary(sender, message) {
  sendMessage(sender, '📅 Itinerary management coming soon! Create, update, and track your trips...');
}

function sendMessage(to, text) {
  console.log(`[SendMessage] To: ${to}, Text: ${text}`);
  // TODO: Integrate with actual WhatsApp/wacli
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'travel-agent' });
});

app.listen(PORT, () => {
  console.log(`Travel Agent running on port ${PORT}`);
});
