// Mock data
const mockWeatherData = {
    temperature: 28,
    humidity: 60,
    rain: 2,
    wind_speed: 12
};

const mockSensorData = {
    displacement: 0.3,
    vibration: 1.2,
    pore_pressure: 0.7
};

const mockRiskPrediction = "Medium";

const mockTimeSeriesData = [
    { time: "08:00", vibration: 0.8 },
    { time: "09:00", vibration: 1.1 },
    { time: "10:00", vibration: 0.9 },
    { time: "11:00", vibration: 1.2 },
    { time: "12:00", vibration: 0.7 },
    { time: "13:00", vibration: 1.4 },
    { time: "14:00", vibration: 1.0 },
    { time: "15:00", vibration: 1.3 }
];

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initializeDashboard();
    createChart();
});

function initializeDashboard() {
    // Load mock data into UI
    loadWeatherData();
    loadSensorData();
    loadRiskPrediction();
    
    // Set up event listeners
    setupEventListeners();
    
    // Animate cards on load
    animateCards();
}

function loadWeatherData() {
    // TODO: Replace with backend API
    // const response = await fetch("http://localhost:8000/weather");
    // const data = await response.json();
    
    document.getElementById('temperature').textContent = `${mockWeatherData.temperature}°C`;
    document.getElementById('humidity').textContent = `${mockWeatherData.humidity}%`;
    document.getElementById('rainfall').textContent = `${mockWeatherData.rain}mm`;
    document.getElementById('windSpeed').textContent = `${mockWeatherData.wind_speed} km/h`;
}

function loadSensorData() {
    // TODO: Replace with backend API
    // const response = await fetch("http://localhost:8000/sensors");
    // const data = await response.json();
    
    document.getElementById('displacement').textContent = `${mockSensorData.displacement}mm`;
    document.getElementById('vibration').textContent = `${mockSensorData.vibration} Hz`;
    document.getElementById('porePressure').textContent = `${mockSensorData.pore_pressure} kPa`;
}

function loadRiskPrediction() {
    // TODO: Replace with backend API
    // const response = await fetch("http://localhost:8000/predict", { method: 'POST' });
    // const data = await response.json();
    
    const riskElement = document.getElementById('riskLevel');
    const riskBar = document.getElementById('riskBar');
    
    riskElement.textContent = mockRiskPrediction;
    
    // Update risk styling based on level
    riskElement.className = riskElement.className.replace(/risk-\w+/, '');
    switch(mockRiskPrediction.toLowerCase()) {
        case 'low':
            riskElement.classList.add('risk-low');
            riskBar.style.width = '30%';
            riskBar.className = riskBar.className.replace(/bg-\w+-\d+/, 'bg-green-400');
            break;
        case 'medium':
            riskElement.classList.add('risk-medium');
            riskBar.style.width = '60%';
            riskBar.className = riskBar.className.replace(/bg-\w+-\d+/, 'bg-amber-400');
            break;
        case 'high':
            riskElement.classList.add('risk-high');
            riskBar.style.width = '90%';
            riskBar.className = riskBar.className.replace(/bg-\w+-\d+/, 'bg-red-400');
            break;
    }
    
    // Update timestamp
    document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
}

function setupEventListeners() {
    const predictBtn = document.getElementById('predictBtn');
    const latInput = document.getElementById('latitude');
    const lonInput = document.getElementById('longitude');
    
    predictBtn.addEventListener('click', handlePredictRisk);
    
    // Update coordinates display when inputs change
    [latInput, lonInput].forEach(input => {
        input.addEventListener('input', updateCoordinatesDisplay);
    });
}

function handlePredictRisk() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    if (!latitude || !longitude) {
        alert('Please enter both latitude and longitude coordinates.');
        return;
    }
    
    // Show loading state
    const btn = document.getElementById('predictBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="h-4 w-4 mr-2 animate-spin"></i>Predicting...';
    btn.disabled = true;
    
    // TODO: Replace with your actual backend API call
    // Example integration:
    /*
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
            const response = await fetch("http://localhost:8000/api/predict", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    latitude: parseFloat(latitude), 
                    longitude: parseFloat(longitude) 
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update UI with real data
            updateRiskDisplay(data.risk_level);
            updateWeatherData(data.weather);
            updateSensorData(data.sensors);
            
            showNotification('Risk prediction updated successfully!', 'success');
        } catch (error) {
            console.error('Error predicting risk:', error);
            showNotification('Error connecting to server. Please try again.', 'error');
        } finally {
            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
            lucide.createIcons();
        }
    }
    */
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
        
        // Refresh all data (simulate new prediction)
        loadWeatherData();
        loadSensorData();
        loadRiskPrediction();
        
        // Show success message
        showNotification('Risk prediction updated successfully!', 'success');
    }, 2000);
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

function createChart() {
    const canvas = document.getElementById('vibrationChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Data processing
    const maxVibration = Math.max(...mockTimeSeriesData.map(d => d.vibration));
    const minVibration = Math.min(...mockTimeSeriesData.map(d => d.vibration));
    const dataRange = maxVibration - minVibration;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= mockTimeSeriesData.length - 1; i++) {
        const x = padding + (chartWidth / (mockTimeSeriesData.length - 1)) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    }
    
    // Draw line chart
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    mockTimeSeriesData.forEach((point, index) => {
        const x = padding + (chartWidth / (mockTimeSeriesData.length - 1)) * index;
        const y = padding + chartHeight - ((point.vibration - minVibration) / dataRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#10b981';
    mockTimeSeriesData.forEach((point, index) => {
        const x = padding + (chartWidth / (mockTimeSeriesData.length - 1)) * index;
        const y = padding + chartHeight - ((point.vibration - minVibration) / dataRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    
    // X-axis labels (time)
    mockTimeSeriesData.forEach((point, index) => {
        const x = padding + (chartWidth / (mockTimeSeriesData.length - 1)) * index;
        ctx.fillText(point.time, x, canvas.height - 10);
    });
    
    // Y-axis labels (vibration)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = minVibration + (dataRange / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i + 4;
        ctx.fillText(value.toFixed(1), padding - 10, y);
    }
    
    // Chart title
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Vibration (Hz)', canvas.width / 2, 20);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
        'bg-blue-100 text-blue-800 border border-blue-200'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease-out';
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    loadWeatherData();
    loadSensorData();
    loadRiskPrediction();
    createChart();
}, 30000);