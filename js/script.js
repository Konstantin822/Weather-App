const apiKey = `53d1c4de56b1678fbf9824229221eabb`
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=odesa&appid=${apiKey}`

function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error')
            }
            return response.json()
        })
}

window.addEventListener('load', () => {
    fetchData(apiUrl)
        .then(data => {
            console.log(data)
            getWeatherReport(data)
        })
        .catch(error => console.log(error))

})

let search = document.querySelector('.header_search-btn')

let city = document.querySelector('.weather_city')
let temperature = document.querySelector('.weather__temp-box_temp')
let humidity = document.querySelector('.weather__temp-box_humidity')
let sky = document.querySelector('.weather_description')
let img = document.querySelector('.weather__temp-box_img')

search.addEventListener('click', () => {
    let city = document.querySelector('.header-inp')
    console.log(city)

    let urlSearch = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}`
    fetchData(urlSearch)
        .then(data => {
            console.log(data)
            getWeatherReport(data)
        })
        .catch(error => console.log(error))
    city.value = ''
})

function getWeatherReport(data) {
    let urlInfo = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apiKey}`

    fetchData(urlInfo)
        .then(forecast => {
            console.log(forecast)

            city.innerHTML = data.name + ', ' + data.sys.country
            temperature.innerHTML = Math.floor(data.main.temp - 273) + ' °C'
            humidity.innerHTML = 'Humidity: ' + data.main.humidity + ' %'
            sky.innerHTML = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)

            let icon = data.weather[0].icon
            let iconUrl = 'https://api.openweathermap.org/img/w/' + icon + '.png'
            img.src = iconUrl

            hourForecast(forecast)
            daysForecast(forecast)
        })
        .catch(error => console.log(error))
}

let tempListHour = document.querySelector('.forecast-hour__tempList')
let tempListDays = document.querySelector('.forecast-days__days')

function hourForecast(forecast) {
    tempListHour.innerHTML = ''
    for (let i = 0; i < 5; i++) {
        let date = new Date(forecast.list[i].dt * 1000)

        let hour = document.createElement('div')
        hour.classList.add('forecast-hour__tempList_next')

        let div = document.createElement('div')

        let time = document.createElement('p')
        time.classList.add('time')
        time.innerHTML = (date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', '')

        let temp = document.createElement('p')
        temp.innerHTML = Math.floor(forecast.list[i].main.temp_max - 273) + ' °C' + ' / '
            + Math.floor(forecast.list[i].main.temp_min - 273) + ' °C'

        let description = document.createElement('p')
        description.classList.add('description')
        description.innerHTML = forecast.list[i].weather[0].description.charAt(0).toUpperCase() + forecast.list[i].weather[0].description.slice(1)

        div.append(time, temp)
        hour.append(div, description)
        tempListHour.append(hour)
    }
}

function daysForecast(forecast) {
    tempListDays.innerHTML = ''

    forecast.list.forEach((item, index) => {
        if (index % 8 === 0 && index < 32) {
            console.log(item)

            let div = document.createElement('div')
            div.classList.add('day')

            let date = document.createElement('p')
            date.classList.add('date')
            date.innerHTML = new Date(item.dt * 1000).toDateString(undefined, 'Asia/Kolkata')

            let temp = document.createElement('p')
            temp.classList.add('temp')
            temp.innerHTML = Math.floor(item.main.temp_max - 273) + ' °C' + ' / '
                + Math.floor(item.main.temp_min - 273) + ' °C'

            let description = document.createElement('p')
            description.classList.add('description')
            description.innerHTML = item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1)

            div.append(date, temp, description)
            tempListDays.append(div)
        }
    })
}