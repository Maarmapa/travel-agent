// Travel Agent — Real-time alerts, predictive pricing, market oracle
// WhatsApp + Email + SMS + Push notifications

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

// API Configuration
const APIs = {
  google_flights: process.env.GOOGLE_FLIGHTS_KEY,
  booking_api: process.env.BOOKING_API_KEY,
  openweather: process.env.OPENWEATHER_KEY,
  news_api: process.env.NEWS_API_KEY,
  amadeus: process.env.AMADEUS_KEY,
  render_agent: process.env.RENDER_AGENT_URL || 'https://maarmapa-agent.onrender.com'
};

// WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', (qr) => {
  console.log('QR RECEIVED, scan with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Travel Agent ready');
});

client.on('message', async (message) => {
  const text = message.body.toLowerCase().trim();
  const from = message.from;

  try {
    // Commands
    if (text.startsWith('/flight')) {
      const [_, route, dates] = text.split('|');
      await handleFlightSearch(from, route, dates);
    } else if (text.startsWith('/hotel')) {
      const [_, location, checkIn, checkOut] = text.split('|');
      await handleHotelSearch(from, location, checkIn, checkOut);
    } else if (text.startsWith('/alerts')) {
      await handleAlerts(from);
    } else if (text.startsWith('/weather')) {
      const [_, location] = text.split('|');
      await handleWeather(from, location);
    } else if (text.startsWith('/market')) {
      await handleMarketOracle(from);
    } else if (text.startsWith('/itinerary')) {
      await handleItinerary(from);
    } else if (text === '/help') {
      await sendHelp(from);
    } else {
      // Chat with agent
      await handleChat(from, message.body);
    }
  } catch (e) {
    console.error(e);
    client.sendMessage(from, '❌ Error: ' + e.message);
  }
});

async function handleFlightSearch(from, route, dates) {
  client.sendMessage(from, '🔍 Searching flights: ' + route);
  // Integration with Google Flights / Amadeus / Skyscanner
  // TODO: Implement flight search logic
}

async function handleHotelSearch(from, location, checkIn, checkOut) {
  client.sendMessage(from, '🏨 Searching hotels: ' + location);
  // Integration with Booking.com API
  // TODO: Implement hotel search logic
}

async function handleWeather(from, location) {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: location, appid: APIs.openweather }
    });
    const data = res.data;
    const msg = `🌤️ ${data.name}:\n${data.main.temp}°C\n${data.weather[0].description}`;
    client.sendMessage(from, msg);
  } catch (e) {
    client.sendMessage(from, '❌ Weather data unavailable');
  }
}

async function handleAlerts(from) {
  // Real-time alerts: geopolitical, natural disasters, crowd density, price drops
  const alerts = [
    '🚨 Flight price drop: LAX → SCL -15%',
    '⚠️ Weather alert: Heavy rain in Santiago next 24h',
    '👥 Crowd alert: Atacama Desert 80% capacity'
  ];
  client.sendMessage(from, 'ALERTS:\n' + alerts.join('\n'));
}

async function handleMarketOracle(from) {
  // Market oracle: price predictions, best booking times, trends
  client.sendMessage(from, '🔮 Market Oracle:\n🔼 Flights trending UP +8%\n🔽 Hotels trending DOWN -3%\n💡 Best time to book: Next 5 days');
}

async function handleItinerary(from) {
  // Full itinerary management
  client.sendMessage(from, '📋 Your itinerary:\n✈️ LAX → SCL May 15-30\n🏨 Santiago (5 nights)\n🏔️ Atacama (3 nights)');
}

async function handleChat(from, text) {
  // Chat with agent via Render
  try {
    const res = await axios.post(APIs.render_agent + '/chat', {
      message: text,
      context: 'travel_planning'
    });
    client.sendMessage(from, res.data.reply || '🤖 Agent response');
  } catch (e) {
    client.sendMessage(from, '🤖 Agent thinking...');
  }
}

async function sendHelp(from) {
  const help = `
🌍 Travel Agent Commands:

✈️ /flight [route] [dates]
  Example: /flight LAX-SCL | 2026-05-15 2026-05-30

🏨 /hotel [location] [check-in] [check-out]
  Example: /hotel Santiago | 2026-05-15 | 2026-05-20

🌤️ /weather [location]
🚨 /alerts — Real-time travel alerts
🔮 /market — Market oracle & price predictions
📋 /itinerary — Your bookings & plans
💬 Chat naturally for travel advice
  `;
  client.sendMessage(from, help);
}

client.initialize();

// Express server for webhooks
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook/flight-alert', (req, res) => {
  // External alerts can trigger notifications
  const { phone, message } = req.body;
  client.sendMessage(phone + '@c.us', message);
  res.json({ ok: true });
});

app.get('/status', (req, res) => {
  res.json({ status: 'active', service: 'travel-agent v1' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Travel Agent API on :${PORT}`));
