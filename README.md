# Travel Agent — Real-time Travel Intelligence

Advanced travel planning agent with real-time flight tracking, hotel bookings, weather alerts, crowd monitoring, and predictive market analysis.

## Features

🛫 **Flight Intelligence**
- Real-time flight search (Google Flights, Amadeus, Skyscanner)
- Price predictions & trend analysis
- Booking recommendations

🏨 **Hotel Bookings**
- Booking.com integration
- Price comparison & tracking
- Best-time-to-book oracle

🌤️ **Real-time Alerts**
- Weather anomalies
- Geopolitical risks
- Natural disasters
- Crowd density monitoring
- Price drops

🔮 **Market Oracle**
- Predictive pricing
- Trend analysis
- Optimal booking windows

📱 **WhatsApp Interface**
- Natural language chat
- Command-based queries
- Full itinerary management

📧 **Multi-channel Notifications**
- Email (Gmail)
- SMS (Twilio)
- Push notifications

## Setup

```bash
npm install
cp .env.example .env
# Fill in your API keys
npm start
```

## Commands

```
/flight [route] [dates]      Search flights
/hotel [location] [dates]    Search hotels
/weather [location]          Weather alerts
/alerts                       Real-time travel alerts
/market                       Market oracle & predictions
/itinerary                    View bookings
/help                         Commands help
```

## Architecture

- **WhatsApp client** for user interaction
- **Express.js** webhooks for external alerts
- **Axios** for API integrations
- **Nodemailer** for email notifications
- **Twilio** for SMS alerts

## Deployment

Deploy on Render.com like maarmapa-agent:
```bash
git push render main
```

## Future

- [ ] Instagram/Facebook posting for travel content
- [ ] Video generation for trip highlights
- [ ] Multi-language support
- [ ] Group travel coordination
- [ ] Travel insurance integration
- [ ] Visa/documentation assistance
