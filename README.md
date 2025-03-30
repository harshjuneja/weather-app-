# Weather Dashboard

A modern, responsive weather dashboard built with React, TypeScript, and Tailwind CSS. Features include real-time weather data, 5-day forecast, dark mode, and a beautiful UI with dynamic backgrounds.

## Features

- 🌍 Real-time weather data for any city
- 📊 5-day weather forecast
- 🌓 Dark/Light mode toggle
- 🔍 City search with suggestions
- 📱 Fully responsive design
- 🎨 Dynamic weather-based backgrounds
- ⚡ Smooth animations and transitions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeather API key

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your OpenWeather API key:

   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build files will be in the `dist` directory.

## Deployment

This project can be deployed to various platforms. Here's how to deploy to Vercel:

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenWeather API
- Vite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
