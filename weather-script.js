// ===== WEATHER DASHBOARD SCRIPT =====
// Using OpenWeatherMap API (Free tier - no key required for demo)

// API Configuration
const API_KEY = 'demo'; // Demo key - Use your own key from openweathermap.org
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather Icons Mapping
const weatherIcons = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '🌤️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
};

// Mock Weather Data (for demo purposes)
const mockWeatherData = {
    'Taubatá': {
        coord: { lon: -45.5597, lat: -23.0215 },
        weather: [
            {
                id: 800,
                main: 'Clear',
                description: 'Céu limpo',
                icon: '01d'
            }
        ],
        main: {
            temp: 28.5,
            feels_like: 29.2,
            temp_min: 24.3,
            temp_max: 31.8,
            pressure: 1013,
            humidity: 65
        },
        visibility: 10000,
        wind: {
            speed: 3.5,
            deg: 120
        },
        clouds: { all: 10 },
        sys: {
            country: 'BR',
            sunrise: 1621756800,
            sunset: 1621803600
        },
        name: 'Taubatá',
        timezone: -10800
    },
    'São Paulo': {
        coord: { lon: -46.6333, lat: -23.5505 },
        weather: [
            {
                id: 803,
                main: 'Clouds',
                description: 'Nublado',
                icon: '04d'
            }
        ],
        main: {
            temp: 26.3,
            feels_like: 27.1,
            temp_min: 22.5,
            temp_max: 29.2,
            pressure: 1012,
            humidity: 72
        },
        visibility: 9000,
        wind: {
            speed: 4.2,
            deg: 180
        },
        clouds: { all: 80 },
        sys: {
            country: 'BR',
            sunrise: 1621757200,
            sunset: 1621804000
        },
        name: 'São Paulo',
        timezone: -10800
    },
    'Rio de Janeiro': {
        coord: { lon: -43.1729, lat: -22.9068 },
        weather: [
            {
                id: 500,
                main: 'Rain',
                description: 'Chuva leve',
                icon: '10d'
            }
        ],
        main: {
            temp: 29.7,
            feels_like: 30.8,
            temp_min: 25.4,
            temp_max: 32.1,
            pressure: 1011,
            humidity: 78
        },
        visibility: 8000,
        wind: {
            speed: 5.1,
            deg: 135
        },
        clouds: { all: 60 },
        sys: {
            country: 'BR',
            sunrise: 1621755600,
            sunset: 1621802400
        },
        name: 'Rio de Janeiro',
        timezone: -10800
    },
    'Belo Horizonte': {
        coord: { lon: -43.9378, lat: -19.8267 },
        weather: [
            {
                id: 801,
                main: 'Clouds',
                description: 'Parcialmente nublado',
                icon: '02d'
            }
        ],
        main: {
            temp: 27.2,
            feels_like: 28.0,
            temp_min: 23.1,
            temp_max: 30.5,
            pressure: 1014,
            humidity: 68
        },
        visibility: 9500,
        wind: {
            speed: 3.8,
            deg: 145
        },
        clouds: { all: 40 },
        sys: {
            country: 'BR',
            sunrise: 1621758000,
            sunset: 1621804800
        },
        name: 'Belo Horizonte',
        timezone: -10800
    },
    'Salvador': {
        coord: { lon: -38.5014, lat: -12.9714 },
        weather: [
            {
                id: 802,
                main: 'Clouds',
                description: 'Nublado',
                icon: '03d'
            }
        ],
        main: {
            temp: 31.4,
            feels_like: 32.6,
            temp_min: 27.2,
            temp_max: 34.8,
            pressure: 1010,
            humidity: 75
        },
        visibility: 9200,
        wind: {
            speed: 4.5,
            deg: 110
        },
        clouds: { all: 50 },
        sys: {
            country: 'BR',
            sunrise: 1621754400,
            sunset: 1621801200
        },
        name: 'Salvador',
        timezone: -10800
    }
};

// ===== FETCH WEATHER DATA =====
async function fetchWeatherData(city) {
    showLoading(true);
    hideError();

    try {
        // Using mock data for demo (no API key needed)
        const data = mockWeatherData[city];
        
        if (!data) {
            throw new Error(`Cidade "${city}" não encontrada. Tente outra cidade.`);
        }

        displayCurrentWeather(data);
        displayForecast(city);
        displayWeatherDetails(data);
        displayAdditionalInfo(data);
        updateLastUpdate();
        
        showLoading(false);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

// ===== DISPLAY CURRENT WEATHER =====
function displayCurrentWeather(data) {
    const content = document.getElementById('currentWeatherContent');
    
    const weather = data.weather[0];
    const icon = weatherIcons[weather.icon] || '🌤️';
    const tempC = Math.round(data.main.temp);
    const tempF = Math.round((data.main.temp * 9/5) + 32);
    const tempMin = Math.round(data.main.temp_min);
    const tempMax = Math.round(data.main.temp_max);
    
    content.innerHTML = `
        <div class="weather-header-info">
            <div class="weather-main">
                <div class="weather-icon">${icon}</div>
                <div class="weather-temp">
                    <div class="temperature">${tempC}°C</div>
                    <div class="temp-info">Sensação: ${Math.round(data.main.feels_like)}°C</div>
                    <div class="temp-info">${weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</div>
                </div>
            </div>
            <div class="weather-info">
                <div class="info-item">
                    <span class="info-label">📍 Localização</span>
                    <span class="info-value">${data.name}, ${data.sys.country}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🌡️ Temperatura Máxima</span>
                    <span class="info-value">${tempMax}°C</span>
                </div>
                <div class="info-item">
                    <span class="info-label">❄️ Temperatura Mínima</span>
                    <span class="info-value">${tempMin}°C</span>
                </div>
                <div class="info-item">
                    <span class="info-label">💧 Umidade</span>
                    <span class="info-value">${data.main.humidity}%</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🌬️ Velocidade do Vento</span>
                    <span class="info-value">${(data.wind.speed * 3.6).toFixed(1)} km/h</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🧭 Direção do Vento</span>
                    <span class="info-value">${getWindDirection(data.wind.deg)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🌫️ Visibilidade</span>
                    <span class="info-value">${(data.visibility / 1000).toFixed(1)} km</span>
                </div>
                <div class="info-item">
                    <span class="info-label">💨 Pressão Atmosférica</span>
                    <span class="info-value">${data.main.pressure} hPa</span>
                </div>
            </div>
        </div>
    `;
}

// ===== DISPLAY FORECAST (5 DAYS) =====
function displayForecast(city) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';

    // Generate 5-day forecast with mock data
    const today = new Date();
    const forecastDays = [
        { day: 0, temp: 28, desc: 'Céu limpo', icon: '01d', humidity: 65, wind: 3.5 },
        { day: 1, temp: 26, desc: 'Nublado', icon: '04d', humidity: 70, wind: 4.2 },
        { day: 2, temp: 24, desc: 'Chuva leve', icon: '10d', humidity: 80, wind: 5.1 },
        { day: 3, temp: 25, desc: 'Parcialmente nublado', icon: '02d', humidity: 72, wind: 3.8 },
        { day: 4, temp: 29, desc: 'Céu limpo', icon: '01d', humidity: 60, wind: 3.2 }
    ];

    forecastDays.forEach((forecast, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() + forecast.day);
        const dateStr = formatDate(date);
        const icon = weatherIcons[forecast.icon] || '🌤️';

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${dateStr}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp">${forecast.temp}°C</div>
            <div class="forecast-description">${forecast.desc}</div>
            <div class="forecast-details">
                💧 ${forecast.humidity}% | 💨 ${forecast.wind.toFixed(1)} m/s
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== DISPLAY WEATHER DETAILS =====
function displayWeatherDetails(data) {
    const container = document.getElementById('weatherDetailsContainer');
    container.innerHTML = '';

    const details = [
        { icon: '💧', label: 'Umidade', value: `${data.main.humidity}%` },
        { icon: '🌡️', label: 'Sensação Térmica', value: `${Math.round(data.main.feels_like)}°C` },
        { icon: '🌬️', label: 'Vento', value: `${(data.wind.speed * 3.6).toFixed(1)} km/h` },
        { icon: '💨', label: '💨', value: `${data.main.pressure} hPa` },
        { icon: '☁️', label: 'Nebulosidade', value: `${data.clouds.all}%` },
        { icon: '👁️', label: 'Visibilidade', value: `${(data.visibility / 1000).toFixed(1)} km` }
    ];

    details.forEach(detail => {
        const card = document.createElement('div');
        card.className = 'detail-card';
        card.innerHTML = `
            <div class="detail-icon">${detail.icon}</div>
            <div class="detail-label">${detail.label}</div>
            <div class="detail-value">${detail.value}</div>
        `;
        container.appendChild(card);
    });
}

// ===== DISPLAY ADDITIONAL INFO =====
function displayAdditionalInfo(data) {
    const container = document.getElementById('additionalInfoContainer');
    container.innerHTML = '';

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    const info = [
        { icon: '🌅', label: 'Nascimento do Sol', value: formatTime(sunrise) },
        { icon: '🌇', label: 'Pôr do Sol', value: formatTime(sunset) },
        { icon: '⭐', label: 'Índice UV', value: 'Moderado' },
        { icon: '🏥', label: 'Qualidade do Ar', value: 'Boa' }
    ];

    info.forEach(item => {
        const card = document.createElement('div');
        card.className = 'detail-card';
        card.innerHTML = `
            <div class="detail-icon">${item.icon}</div>
            <div class="detail-label">${item.label}</div>
            <div class="detail-value">${item.value}</div>
        `;
        container.appendChild(card);
    });
}

// ===== UI FUNCTIONS =====
function showLoading(show) {
    const indicator = document.getElementById('loadingIndicator');
    if (show) {
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = `❌ Erro: ${message}`;
    errorDiv.classList.add('show');
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

function hideError() {
    document.getElementById('errorMessage').classList.remove('show');
}

function updateLastUpdate() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = formatTime(now);
}

// ===== SEARCH FUNCTIONS =====
function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeatherData(city);
        document.getElementById('cityInput').value = '';
    }
}

function searchByCity(city) {
    fetchWeatherData(city);
    document.getElementById('cityInput').value = '';
}

// Enter key support
document.getElementById('cityInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// ===== UTILITY FUNCTIONS =====
function getWindDirection(degree) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
}

function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌤️ Weather Dashboard loaded!');
    console.log('📍 Using mock data for demo');
    console.log('💡 Tip: Click on quick city buttons to see different weather data');
});
