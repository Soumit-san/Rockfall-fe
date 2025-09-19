# Backend API Integration Guide for MineGuard AI

## 📍 Where to Put Your Backend APIs

Your backend APIs should replace the mock data in these specific functions in `script.js`:

### 1. Weather Data API
**Location:** `loadWeatherData()` function (line ~85)
**Replace:** Mock weather data
**Expected API:** `GET /api/weather`
**Expected Response:**
```json
{
  "temperature": 28,
  "humidity": 60,
  "rain": 2,
  "wind_speed": 12
}
```

### 2. Sensor Data API
**Location:** `loadSensorData()` function (line ~95)
**Replace:** Mock sensor data
**Expected API:** `GET /api/sensors`
**Expected Response:**
```json
{
  "displacement": 0.3,
  "vibration": 1.2,
  "pore_pressure": 0.7
}
```

### 3. Risk Prediction API
**Location:** `loadRiskPrediction()` function (line ~105)
**Replace:** Mock risk prediction
**Expected API:** `POST /api/predict`
**Request Body:**
```json
{
  "latitude": 45.7640,
  "longitude": 4.8357
}
```
**Expected Response:**
```json
{
  "risk_level": "Medium",
  "confidence": 0.85,
  "factors": ["weather", "sensors", "geological"]
}
```

### 4. Time Series Data API
**Location:** `createChart()` function (line ~200)
**Replace:** `mockTimeSeriesData`
**Expected API:** `GET /api/timeseries?hours=8`
**Expected Response:**
```json
[
  { "time": "08:00", "vibration": 0.8 },
  { "time": "09:00", "vibration": 1.1 },
  { "time": "10:00", "vibration": 0.9 }
]
```

## 🔧 How to Integrate

### Step 1: Replace Mock Functions
1. Find the function you want to integrate (e.g., `loadWeatherData()`)
2. Uncomment the example API code in the comments
3. Replace `http://localhost:8000` with your actual backend URL
4. Remove or comment out the mock data lines

### Step 2: Handle Errors
Each API call should include error handling:
```javascript
try {
  const response = await fetch("your-api-url");
  const data = await response.json();
  // Update UI with real data
} catch (error) {
  console.error('API Error:', error);
  // Keep using mock data as fallback
}
```

### Step 3: Update API Endpoints
Change these placeholder URLs to your actual backend:
- `http://localhost:8000/api/weather` → Your weather API
- `http://localhost:8000/api/sensors` → Your sensor API  
- `http://localhost:8000/api/predict` → Your prediction API
- `http://localhost:8000/api/timeseries` → Your timeseries API

### Step 4: Test Integration
1. Start your backend server
2. Update one API endpoint at a time
3. Test in browser console for any errors
4. Verify data displays correctly in the UI

## 🌐 Backend Requirements

Your backend should provide these endpoints:

```
GET  /api/weather     - Current weather data
GET  /api/sensors     - Current sensor readings
POST /api/predict     - Risk prediction (requires lat/lng)
GET  /api/timeseries  - Historical sensor data for charts
```

## 🔄 Auto-Refresh

The dashboard automatically refreshes data every 30 seconds (line ~300). Your backend should handle frequent requests efficiently.

## 🚨 CORS Configuration

Make sure your backend allows CORS requests from your frontend domain:
```javascript
// Example for Express.js
app.use(cors({
  origin: 'http://localhost:5173' // Your frontend URL
}));
```

## 📱 Error Handling

The frontend includes built-in error handling and will:
- Show error notifications to users
- Fall back to mock data if APIs fail
- Log errors to browser console for debugging

Replace the mock data step by step, testing each integration before moving to the next one.