const API_KEY = '4ce31300c4d8d491c494bc9971251cba'; // OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function initWeatherWidget() {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  try {
    const city = 'Ulaanbaatar';
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    // Optional: Add a small loading state
    widget.innerHTML = `<p class="weather-loading">Цаг агаар ачаалж байна...</p>`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    
    const data = await res.json();
    
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const temp = Math.round(data.main.temp);
    // Capitalize the description
    const desc = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    
    widget.innerHTML = `
      <div class="weather-icon">
          <img src="${iconUrl}" alt="${desc}" />
      </div>
      <div class="weather-info">
          <div class="weather-temp">${temp}°C</div>
          <div class="weather-desc">${desc}</div>
      </div>
    `;
  } catch (err) {
    widget.innerHTML = `<p class="weather-error">Цаг агаар унших үед алдаа гарлаа.</p>`;
    console.error('Weather widget error:', err);
  }
}
