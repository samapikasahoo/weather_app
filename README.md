# Weather-Reporter

Weather-Reporter is a comprehensive web application that provides real-time weather data with AI-powered insights using Gemini. The application features an interactive map interface, geolocation support, and 7-day forecasts to help users stay informed about current and upcoming weather conditions worldwide.

## Features

The Weather-Reporter application offers a comprehensive set of features including, but not limitted to:

- 🔄 **Automatic Weather Updates**: Refreshes weather data every 5 minutes to ensure you have the most current information.
- ⚡ **Real-Time Weather Data**: Provides up-to-the-minute weather conditions for your selected location.
- 🤖 **AI-Powered Insights**: Leverages Gemini AI to offer context-aware analysis and interpretation of current weather conditions.
- 📍 **Geolocation Support**: Automatically detects your location to provide relevant weather information without manual input.
- 📅 **7-Day Forecast**: Shows detailed weather predictions for the upcoming week to help you plan ahead.
- 🗺️ **Interactive Map Interface**: Visualizes your selected location on a map, making it easy to confirm the exact area for which weather data is being displayed.
- 🌎 **Global Coverage**: Access weather information for locations worldwide with comprehensive international support.

## 🚀 Getting Started

### 📋 Prerequisite

Following software prerequisites need to be installed on your machine

- NPM (Node Package Manager) - `v10.7.0`
- [Node.js](https://nodejs.org/) - `v20.15.1`
- [Ballerina](https://ballerina.io/downloads/) - `v2201.12.7`

### 🖥️ Build the Frontend

Before running the frontend service, Create a file named `.env` with the following configurations.

```env
VITE_BACKEND_CHOREO_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_LOCATIONIQ_API_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_LOCATIONIQ_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 📦 Install Dependencies

```bash
npm install
```

#### ▶️ Up the Frontend Application

```bash
npm run dev
```

#### 🧪 Run the Tests

```bash
npm run test
```

### ⚙️ Build the Backend

#### 🏃 Run the Backend Service

Before running the backend service, Create a file named `Config.toml` with the following configurations.

```Toml
openWeatherApiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
geminiApiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
locationIQApiKey= "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Then execute the below command

```bash
bal run ./backend
```

Note: Uncomment the following lines in the `./backend/service.bal` to avoid the CORS issues.

```Ballerina
// For the local Development, uncomment the below code to enable CORS
// @http:ServiceConfig {
//     cors: {
//         allowOrigins: ["http://localhost:5173"],
//         allowMethods: ["GET"]
//     }
// }

service / on new http:Listener(9090) {
  // For the local Development, uncomment the below code to enable CORS
  // @http:ResourceConfig {
  //     cors: {
  //         allowOrigins: ["http://localhost:5173"],
  //         allowMethods: ["GET"]
  //     }
  // }
```

#### 🧪 Run the Backend Tests

```bash
bal test ./backend
```
