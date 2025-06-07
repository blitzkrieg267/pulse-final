# PulseInvest: The Bank of the Future Prototype

> Empowering Inclusive Prosperity through AI-Driven Digital Investments

## Hackathon Context

This project was developed for the **FNB Bank of the Future Challenge**, aiming to create digital, smart, and innovative solutions for future banking that deliver convenience, intrigue, and value to customers.

## Team Introduction

**Team Name: The Innovators**

- **Nachalo Letsunyane** - Project Lead + Backend Dev
- **Thabo April** - Financial Analyst
- **King Rantsetse** - Corporate Financial Analyst
- **Olerile Phillip** - Frontend Developer (UI/UX)
- **Okth Olweny** - Frontend Developer (UI/UX)

This prototype represents the collective effort of our team to reimagine banking through innovative technology.

## About PulseInvest Prototype

PulseInvest is a revolutionary concept that positions FNB as a "Giant Broker for the Masses," offering guaranteed tiered returns through AI-driven investment strategies. This React Native prototype demonstrates the core user investment journey with a focus on mobile-first design and FNB branding.

**Key Design Elements:**
- FNB Brand Colors: Primary Blue (#1976d2), Accent Gold (#ffd700)
- Modern UI: Prominent rounded corners, subtle shadows
- Mobile-First Approach: Optimized for mobile devices

## Implemented Features

### 1. User Authentication (Simulated)
- Login and Signup screens
- In-memory state management
- Session-based authentication

### 2. Investment Configuration
- Investment Amount input (minimum BWP 150)
- Guaranteed Return Rate selection (5%, 10%, 15%, 20%, 25%)
- AI-driven holding time calculation

### 3. AI-Powered Recommendation (Simulated)
- Minimum Holding Time display
- Alternative investment suggestions
- Simulated AI processing with loading states

### 4. Investment Confirmation & Payment
- Investment summary modal
- Fixed processing fee (BWP 10)
- Simulated payment success
- Local investment state updates

### 5. Dashboard
- Total investments overview
- Active investments tracking
- Expected payouts visualization

### 6. Current Investments
- Active investment listings
- Detailed investment information
- Local state management

### 7. Past Payouts
- Completed investment history
- Payout details and statistics

### 8. Investment Windows
- Current window display with countdown
- Past investment windows history
- Investment activity tracking (5 attempts/60 days)
- Visual limit indicators

### 9. Market Trends
- Market Charts (S&P 500, JSE, Commodities)
- Personal Investment Insights
- Market Resources
- Learning Hub

## Business Case Implementation

The prototype demonstrates key business concepts:

- **Guaranteed Tiered Returns**: Implemented through return rate selection
- **AI Calculator Engine**: Simulated through deterministic calculations
- **Low Investment Threshold**: BWP 150 minimum investment
- **Fixed Investment Windows**: Visual simulation with countdown
- **Investment Limits**: 5 attempts per 60-day period
- **FNB as Giant Broker**: Simplified, accessible UI
- **Diversified Trading**: Market trends visualization

## Setup and Run Instructions

### Prerequisites
- Node.js
- npm
- Expo CLI
- Mobile simulator (Android Studio/Xcode) or physical device

### Installation Steps
```bash
# Clone the repository
git clone [repository_url]

# Navigate to project directory
cd project

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running the App

#### Mobile Device/Simulator
1. Open Expo Go on your mobile device
2. Scan the QR code from the terminal
3. Or press 'a' for Android simulator or 'i' for iOS simulator

#### Web Browser
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Press 'w' in the terminal to open in web browser
3. Alternatively, open http://localhost:19006 in your browser

Note: For the best experience on web:
- Use Chrome, Firefox, or Edge (latest versions)
- Enable hardware acceleration in your browser
- Keep the browser window at a reasonable size (recommended: 375px width for mobile view)

## Prototype Limitations

- **Frontend-Only**: No backend server or database integration
- **Simulated Data**: All data is managed in local state
- **No Real APIs**: Market data and authentication are simulated
- **No Persistence**: Data resets on app restart

## Future Enhancements

- Backend integration with Node.js & MongoDB
- Real AI Calculator Engine implementation
- FNB core banking system integration
- Live market data integration
- Persistent authentication
- Real-time investment tracking

## Contributing

This is a prototype developed for the FNB Bank of the Future Challenge. For more information about contributing to the project, please contact the team.

## License

This project is proprietary and confidential. All rights reserved. 