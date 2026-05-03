# Travel Agent 🌍✈️

WhatsApp-based travel assistant with real-time flight/hotel search, weather alerts, safety monitoring, and market predictions.

## Features

- **Flight Search** — Integration with Google Flights, Skyscanner, Kayak, Amadeus
- **Hotel Search** — Booking.com, Airbnb, Hotels.com integration
- **Weather Alerts** — Real-time forecasts and severe weather warnings
- **Safety Monitoring** — Geopolitical alerts, natural disasters, crowd density tracking
- **Market Oracle** — Price predictions and optimal booking windows
- **Email/SMS Alerts** — Gmail, Twilio notifications for critical updates
- **Itinerary Management** — Create and manage full travel plans

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env`:
```
PORT=3000
WHATSAPP_API_URL=https://api.whatsapp.com/send
GOOGLE_FLIGHTS_API_KEY=xxx
BOOKING_API_KEY=xxx
AMADEUS_API_KEY=xxx
OPENWEATHER_API_KEY=xxx
NEWS_API_KEY=xxx
GMAIL_USER=xxx
TWILIO_SID=xxx
TWILIO_TOKEN=xxx
```

3. Run:
```bash
npm start
```

## API Integrations (TODO)

- [ ] Google Flights API
- [ ] Booking.com API
- [ ] Skyscanner API
- [ ] Kayak API
- [ ] Amadeus API
- [ ] OpenWeather API
- [ ] NewsAPI (geopolitical alerts)
- [ ] Gmail API (notifications)
- [ ] Twilio (SMS alerts)

## WhatsApp Commands

- `/flight [from] [to] [date]` — Search flights
- `/hotel [city] [checkin] [checkout]` — Search hotels
- `/weather [city]` — Get weather forecast
- `/alerts` — Get travel alerts
- `/market [route]` — Get price predictions
- `/itinerary [add|list|update]` — Manage itinerary

## Deployment

Deploy to Render:
```bash
git push origin main
# Auto-deploys via Render webhook
```

## TODO

- [ ] Integrate all APIs
- [ ] Implement market oracle ML model
- [ ] Add geopolitical/weather alert aggregation
- [ ] Full itinerary engine
- [ ] Email and SMS notifications
- [ ] Real-time crowd monitoring
