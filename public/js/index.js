getDefaultWeather()

//default weather by location
function getDefaultWeather(){
  $.get("https://ipinfo.io?token=ca7bb26763c6c3", function({loc, city, country}) {
    const location = loc.split(',')
    const latitude = location[0];
    const longitude = location[1]
    const place = city && `${city}, ${country}`
    searchWeather(place, latitude, longitude)
  }, "json")
}

// search weather
const searchElement = document.getElementById('search')
const searchBox = new google.maps.places.SearchBox(searchElement)

//prevent page reload on 'enter' key while submitiing search-box
google.maps.event.addDomListener(searchElement, 'keydown', function (e) {
  if (e.keyCode == 13) {
      e.preventDefault();
  }
});

//searchbox listener
searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0]
  if (place == null) return
  const latitude = place.geometry.location.lat()
  const longitude = place.geometry.location.lng()
  searchWeather(place.formatted_address, latitude, longitude)
  
})
// serch weather function
function searchWeather(place, latitude, longitude){
  fetch('/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      latitude: latitude,
      longitude: longitude
    })
  })
  .then(res => res.json())
  .then(data => {
    setWeatherData(data, place)
    let daily = data.daily.data.slice(1, 7)
    const dailyItem = daily.map((item,i) => {
      let date = new Date(item.time * 1000)
      date = date.toLocaleString("us", {
        weekday: 'short'
      })
      let minTemp = Math.round(item.temperatureMin)
      let maxTemp =  Math.round(item.temperatureMax)
      let windSpeed = Math.round(item.windSpeed)
        return (`
          <div class="col-lg-2 col-md-4 col-sm-6 col-12 daily-conditions">
              <div class="daily-week-day">${date}</div>
              <div class="daily-icon-container text-center">
                  <canvas id="icon-ext-${i}" width="50" height="50"></canvas>
              </div>
              <div class="daily-temp">
                  <span class="min-temp">${minTemp}</span>
                  <span class="max-temp">${maxTemp}</span>
              </div>
              <div class="daily-wind">
                  <i class="fas fa-wind"></i>
                  <span class="wind-speed-daily">${windSpeed}</span>
                  <i class="fas fa-long-arrow-alt-up wind-direction-daily mx-2" style="transform:rotate(${item.windBearing}deg)"></i>
              </div>
          </div>
      `)
    })
    dailyItems.innerHTML = dailyItem.join('')
    daily.forEach((item,i)=>{
      const dailyIcon = new Skycons({
        color: '#222'
      })
      dailyIcon.set(`icon-ext-${i}`, item.icon)
      dailyIcon.play()
    })
  })
}

//icons
const currentIcon = new Skycons({
  color: '#222'
})
const headerLogo = new Skycons({
  color: '#FFC107'
})

const locationElement = document.querySelector('[data-location]')
const currentTemperatureElement = document.querySelector('[data-temp-current]')
const feelsLikeElement = document.querySelector('[data-feels-like]')
const summaryElement = document.querySelector('[data-summary]')
const windSpeedElement = document.querySelector('[data-wind-speed]')
const windDirectionElement = document.querySelector('[data-wind-direction]')
const humidityElement = document.querySelector('[data-humidity]')
const uvElement = document.querySelector('[data-uv]')
const pressureElement = document.querySelector('[data-pressure]')
const visibilityElement = document.querySelector('[data-visibility]')

//set weather data
function setWeatherData(data, place) {
  const {
    temperature, 
    apparentTemperature, 
    summary,
    windSpeed,
    windBearing,
    humidity,
    uvIndex,
    pressure,
    visibility,
    icon
  } = data.currently;

  locationElement.textContent = place
  currentTemperatureElement.textContent = `${Math.round(temperature)} °C`
  feelsLikeElement.textContent = `${Math.round(apparentTemperature)} °C`
  summaryElement.textContent = summary
  windSpeedElement.textContent = `${Math.round(windSpeed)} m/s`
  windDirectionElement.style.transform = `rotate(${windBearing}deg)`
  humidityElement.textContent =`${Math.round(humidity * 100)} %`
  uvElement.textContent = `${uvIndex}`
  pressureElement.textContent = `${Math.round(pressure)} hPa`
  visibilityElement.textContent = `${Math.round(visibility)} km`

  //set currently icon
  currentIcon.set('icon', icon)
  currentIcon.play()

  //set header icon to be equal currrently icon
  headerLogo.set('headerLogo', icon)
  headerLogo.play()
}
