# Currency API

A simple Node.js REST API for serving mock currency quotes. Built with Express.js and CORS for cross-origin support. This project is ideal for learning, prototyping, or as a backend for frontend currency applications.

## Features

This project implements several distinct features:

### 1. Fast, Lightweight Express Server
- Uses [Express.js](https://expressjs.com/) to create a minimal REST API server.
- Handles HTTP requests efficiently and is easy to extend with new routes.
- The server is started in `server.js` and listens on a configurable port.

### 2. CORS Enabled for Easy Frontend Integration
- Integrates the [cors](https://www.npmjs.com/package/cors) middleware to allow cross-origin requests.
- Ensures that web applications hosted on different domains can access the API without browser restrictions.
- CORS is enabled globally for all endpoints.

### 3. Root Status Endpoint
- **GET /**
- Returns a simple status message to confirm the API is running.
- Useful for health checks and basic connectivity tests.

### 4. Mock Currency Quote Endpoint
- **GET /quotes**
- Returns an array of mock currency quotes, each with `buy_price`, `sell_price`, and `source` fields.
- Designed for frontend development, testing, and prototyping without needing real data sources.
- The mock data is hardcoded in `server.js` for simplicity.

### 5. Easy to Extend for Real Data Sources
- The code is structured so you can replace the mock data with real API calls or database queries.
- Add new endpoints or modify existing ones by editing `server.js`.

### 6. Configurable Port
- The server port can be set using the `PORT` environment variable, making it flexible for deployment.

### 7. Simple Project Structure
- Only two main files: `server.js` (source code) and `package.json` (dependencies).
- Easy to understand and modify for beginners and experienced developers alike.

---
## Feature Details

| Feature                | File/Location   |Description                                                                 |
|------------------------|-----------------|-----------------------------------------------------------------------------|
| Express server         | server.js       | Sets up the main API server and routes.                                     |
| CORS support           | server.js       | Enables cross-origin requests for all endpoints.                            |
| Root endpoint          | server.js       | Returns API status message.                                                 |
| Quotes endpoint        | server.js       | Returns mock currency quotes as JSON.                                       |
| Port configuration     | server.js       | Uses `process.env.PORT` or defaults to 3000.                                |
| Dependency management  | package.json    | Lists required npm packages (express, cors).                                |

---

## Requirements
- Node.js (v14 or newer recommended)
- npm (comes with Node.js)

## Installation
1. Clone the repository:
   ```cmd
   git clone https://github.com/srijithjnair/currency-api.git
   cd currency-api
   ```
2. Install dependencies:
   ```cmd
   npm install
   ```

## Usage
Start the server:
```cmd
node server.js
```

By default, the server runs on port 3000. You can change the port by setting the `PORT` environment variable:
```cmd
set PORT=8080
node server.js
```

## API Endpoints

### Root
- **GET /**
  - Returns a simple status message.
  - Example response:
    ```text
    Currency API running 🚀
    ```

### Quotes
- **GET /quotes**
  - Returns an array of mock currency quotes.
  - Example response:
    ```json
    [
      { "buy_price": 140.3, "sell_price": 144.0, "source": "mock-source-1" },
      { "buy_price": 141.2, "sell_price": 145.0, "source": "mock-source-2" },
      { "buy_price": 142.0, "sell_price": 146.0, "source": "mock-source-3" }
    ]
    ```

## Customization
- To add real currency data, replace the mock data in `server.js` with API calls or database queries.
- Add more endpoints as needed using Express's routing features.

## Troubleshooting
- **Port already in use:** Change the `PORT` variable or stop the conflicting process.
- **CORS errors:** CORS is enabled by default, but you can configure it in `server.js`.
- **Dependency issues:** Run `npm install` to ensure all packages are installed.

## Live deployment (optional)

The project is deployed live at:

Live demo: [Live demo](https://currency-api-eno1.onrender.com/)

If you have a different URL for a staging or alternate deployment, replace the link above or add additional links here.

## License
MIT

## Author
srijithjnair
