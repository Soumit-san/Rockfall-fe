// ===============================
// Backend API Configuration
// ===============================
const API_BASE_URL = 'https://mineguard-backend-1.onrender.com';

// Fallback mock data in case API fails
const fallbackWeatherData = {
    temperature: 28,
    humidity: 60,
    rainfall: 2,
    wind_speed: 12
};

const fallbackSensorData = {
    displacement: 0.3,
    vibration: 1.2,
    pore_pressure: 0.7
};

const fallbackRiskPrediction = "Medium";

const fallbackTimeSeriesData = [
    { time: "08:00", vibration: 0.8 },
    { time: "09:00", vibration: 1.1 },
    { time: "10:00", vibration: 0.9 },
    { time: "11:00", vibration: 1.2 },
    { time: "12:00", vibration: 0.7 },
    { time: "13:00", vibration: 1.4 },
    { time: "14:00", vibration: 1.0 },
    { time: "15:00", vibration: 1.3 }
];

// ===============================
// Init
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initializeDashboard();
    createChart(fallbackTimeSeriesData);
});

function initializeDashboard() {
    loadWeatherData();
    loadSensorData();
    loadRiskPrediction();
    loadTimeSeriesData();
    setupEventListeners();
    animateCards();
}

// ===============================
// Weather Data
// ===============================
async function loadWeatherData() {
    try {
        const latitude = document.getElementById('latitude').value || 45.7640;
        const longitude = document.getElementById('longitude').value || 4.8357;
        
        const response = await fetch(`${API_BASE_URL}/weather/${latitude}/${longitude}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();

        // Flexible key mapping
        const temp = data.temperature ?? fallbackWeatherData.temperature;
        const humidity = data.humidity ?? fallbackWeatherData.humidity;
        const rainfall = data.rain ?? data.rainfall ?? fallbackWeatherData.rainfall;
        const wind = data.wind_speed ?? data.wind ?? fallbackWeatherData.wind_speed;

        document.getElementById('temperature').textContent = `${temp}°C`;
        document.getElementById('humidity').textContent = `${humidity}%`;
        document.getElementById('rainfall').textContent = `${rainfall}mm`;
        document.getElementById('windSpeed').textContent = `${wind} km/h`;

        console.log('✅ Weather data loaded:', data);
    } catch (error) {
        console.error('❌ Error loading weather data:', error);
        useFallbackWeather();
    }
}

function useFallbackWeather() {
    document.getElementById('temperature').textContent = `${fallbackWeatherData.temperature}°C`;
    document.getElementById('humidity').textContent = `${fallbackWeatherData.humidity}%`;
    document.getElementById('rainfall').textContent = `${fallbackWeatherData.rainfall}mm`;
    document.getElementById('windSpeed').textContent = `${fallbackWeatherData.wind_speed} km/h`;
    showNotification('Using offline weather data', 'warning');
}

// ===============================
// Sensor Data
// ===============================
async function loadSensorData() {
    try {
        const response = await fetch(`${API_BASE_URL}/sensors/vibration`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        const disp = data.displacement ?? fallbackSensorData.displacement;
        const vib = data.vibration ?? fallbackSensorData.vibration;
        const pore = data.pore ?? data.pore_pressure ?? fallbackSensorData.pore_pressure;

        document.getElementById('displacement').textContent = `${disp}mm`;
        document.getElementById('vibration').textContent = `${vib} Hz`;
        document.getElementById('porePressure').textContent = `${pore} kPa`;

        console.log('✅ Sensor data loaded:', data);
    } catch (error) {
        console.error('❌ Error loading sensor data:', error);
        useFallbackSensor();
    }
}

function useFallbackSensor() {
    document.getElementById('displacement').textContent = `${fallbackSensorData.displacement}mm`;
    document.getElementById('vibration').textContent = `${fallbackSensorData.vibration} Hz`;
    document.getElementById('porePressure').textContent = `${fallbackSensorData.pore_pressure} kPa`;
    showNotification('Using offline sensor data', 'warning');
}

// ===============================
// Risk Prediction
// ===============================
async function loadRiskPrediction() {
   try {
        const latitude = parseFloat(document.getElementById('latitude').value) || 23.0;
        const longitude = parseFloat(document.getElementById('longitude').value) || 86.5;

        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        console.log("Prediction API Response:", data);

        // Fix: unwrap risk if it's nested in an object
        let riskValue = data.risk || data.risk_level || data.prediction;

        if (typeof riskValue === "object") {
            riskValue = riskValue.risk ?? JSON.stringify(riskValue); 
        }

        updateRiskDisplay(riskValue, data.alert);
    } catch (error) {
        console.error('❌ Error loading risk prediction:', error);
        updateRiskDisplay(fallbackRiskPrediction, null);
        showNotification('Using offline risk prediction', 'warning');
    }
}

// ===============================
// Risk Display
// ===============================
function updateRiskDisplay(riskPrediction) {
    const riskElement = document.getElementById('riskLevel');
    const riskBar = document.getElementById('riskBar');

    const risk = String(riskPrediction).toLowerCase();
    riskElement.textContent = risk.charAt(0).toUpperCase() + risk.slice(1);

    // Reset class
    riskElement.className = riskElement.className.replace(/risk-\w+/, '');
    
    switch(risk) {
        case 'low':
            riskElement.classList.add('risk-low');
            riskBar.style.width = '30%';
            riskBar.className = 'h-2 rounded-full bg-green-400';
            break;
        case 'medium':
            riskElement.classList.add('risk-medium');
            riskBar.style.width = '60%';
            riskBar.className = 'h-2 rounded-full bg-amber-400';
            break;
        case 'high':
            riskElement.classList.add('risk-high');
            riskBar.style.width = '90%';
            riskBar.className = 'h-2 rounded-full bg-red-400';
            break;
    }

    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
}

// ===============================
// Event Handlers
// ===============================
function setupEventListeners() {
    const predictBtn = document.getElementById('predictBtn');
    const latInput = document.getElementById('latitude');
    const lonInput = document.getElementById('longitude');

    predictBtn.addEventListener('click', handlePredictRisk);
    [latInput, lonInput].forEach(input => {
        input.addEventListener('input', updateCoordinatesDisplay);
    });
}

async function handlePredictRisk() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!latitude || !longitude) {
        alert('Please enter both latitude and longitude coordinates.');
        return;
    }

    const btn = document.getElementById('predictBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="h-4 w-4 mr-2 animate-spin"></i>Predicting...';
    btn.disabled = true;

    try {
        await loadRiskPrediction();
        await loadWeatherData();
        await loadSensorData();
        await loadTimeSeriesData();
        showNotification('Risk prediction updated successfully!', 'success');
    } catch (error) {
        console.error('❌ Error predicting risk:', error);
        showNotification('Error connecting to server. Please try again.', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
    }
}

function updateCoordinatesDisplay() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const display = document.getElementById('coordinates-display');
    const coords = document.getElementById('current-coords');

    if (latitude && longitude) {
        coords.textContent = `${latitude}, ${longitude}`;
        display.classList.remove('hidden');
    } else {
        display.classList.add('hidden');
    }
}

function animateCards() {
    const cards = document.querySelectorAll('.card-animate');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===============================
// Chart
// ===============================
async function loadTimeSeriesData() {
    try {
        const response = await fetch(`${API_BASE_URL}/sensors/vibration`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // If backend doesn’t return time-series, fallback mock is used
        createChart(fallbackTimeSeriesData);
    } catch (error) {
        console.error('❌ Error loading time series data:', error);
        createChart(fallbackTimeSeriesData);
        showNotification('Using offline chart data', 'warning');
    }
}

// (Assumes createChart is already implemented elsewhere)

// ===============================
// Notifications
// ===============================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
        type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
        'bg-blue-100 text-blue-800 border border-blue-200'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Auto-refresh every 30s
setInterval(() => {
    loadWeatherData();
    loadSensorData();
    loadRiskPrediction();
    loadTimeSeriesData();
}, 30000);
