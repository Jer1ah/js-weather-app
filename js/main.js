const weatherButton = document.getElementsByTagName("BUTTON")[0];
const zipcodeInput = document.getElementsByTagName("INPUT")[0];
const currentTemp = document.getElementsByClassName("weather__main--temp")[0];
const currentCity = document.getElementsByClassName("weather__main--city")[0];
const currentForcast = document.getElementsByClassName("weather__main--forcast")[0];
const currentDayElement = document.getElementsByClassName("weather__lower--day")[0];
const futureDays = document.getElementsByClassName("weather__item--day");
const dailyHigh = document.getElementsByClassName("weather__item--high");
const dailyLow = document.getElementsByClassName("weather__item--low");
const imgs = document.getElementsByClassName("weather__item--icon");


//Adding functionality for setting days of week on button click
weatherButton.addEventListener("click", () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let now = new Date();
    let currentDayIndex = now.getDay();
    currentDayElement.innerHTML = days[currentDayIndex];
    //Adding days for futurecast
    for(let i = 0, j = currentDayIndex + 1; i < 5; i++, j++){       
        if(j > 5){
          j = 0
        }
        futureDays[i].innerHTML = days[j];
    }
});

//Adding functionality for fetching current weather on button click
weatherButton.addEventListener("click", () => {
    let userZip = zipcodeInput.value;

    fetch(`http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=yjhc9euukkwR393enGgBNNlSaIA1i0T4&q=${userZip}`)
    .then((weatherObject) => {
        return weatherObject.json();
    })
    .then((weather) => {
        // Changing city name to current city  
        currentCity.innerHTML = weather[0].LocalizedName;
        let zipcode = weather[0].Key;
        return fetch(`http://dataservice.accuweather.com/currentconditions/v1/${zipcode}?apikey=yjhc9euukkwR393enGgBNNlSaIA1i0T4`);
    })
    .then((currentWeatherObject) => {
        return currentWeatherObject.json()
    })
    .then((currentWeather) => {
        // Changing weather condition text dynamically
        currentForcast.innerHTML = currentWeather[0].WeatherText;
        let temp = currentWeather[0].Temperature.Imperial.Value;
        currentTemp.innerHTML = temp + "&deg;";
    })
});

//Adding functionality for fetching futurecast weather
weatherButton.addEventListener("click", () => {
    let userZip = zipcodeInput.value;

    fetch(`http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=yjhc9euukkwR393enGgBNNlSaIA1i0T4&q=${userZip}`)
    .then((weatherObject) => {
        return weatherObject.json();
    })
    .then((weather) => {
        let zipcode = weather[0].Key;
        return fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${zipcode}?apikey=yjhc9euukkwR393enGgBNNlSaIA1i0T4`);
    })
    .then((futureWeatherObject) => {
        return futureWeatherObject.json();
    })
    .then((weatherObject) => {
        return weatherObject.DailyForecasts;
    })
    .then((dailyForecasts) => {
        for( let i = 0; i < 5; i++) {
            if( dailyForecasts[i].Day.Icon === 1 ) {
                imgs[i].src = "img/sun.svg";
            } else if( dailyForecasts[i].Day.Icon > 1 && dailyForecasts[i].Day.Icon < 7 ) {
                imgs[i].src = "img/partlySunny.svg";
            } else if( dailyForecasts[i].Day.Icon > 6 && dailyForecasts[i].Day.Icon < 12 ) {
                imgs[i].src = "img/clouds.svg";
            } else if( dailyForecasts[i].Day.Icon > 11 && dailyForecasts[i].Day.Icon < 15 ) {
                imgs[i].src = "img/drop.svg";
            } else if( dailyForecasts[i].Day.Icon > 14 && dailyForecasts[i].Day.Icon < 18 ) {
                imgs[i].src = "img/storm.svg";
            } else if( dailyForecasts[i].Day.Icon === 18 ) {
                imgs[i].src = "img/drop.svg";
            } else if( dailyForecasts[i].Day.Icon > 18 && dailyForecasts[i].Day.Icon < 30 ) {
                imgs[i].src = "img/snow.svg";
            } else if( dailyForecasts[i].Day.Icon === 32 ) {
                imgs[i].src = "img/wind.svg";
            }
            dailyHigh[i].innerHTML = dailyForecasts[i].Temperature.Maximum.Value;
            dailyLow[i].innerHTML = dailyForecasts[i].Temperature.Minimum.Value;
        }
    })
});