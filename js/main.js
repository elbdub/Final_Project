console.clear;

const API_KEY = "39fc93c2a4e618396ba3aa95200af967";
const URL = "https://api.openweathermap.org/data/2.5/weather?";
const units = "Imperial";

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});



const initApp = () => {
    //add listeners
    const itemCityInfo = document.getElementById("getWeather");
    itemCityInfo.addEventListener("click", (event) => {
        event.preventDefault();
        //processSubmission();
        weatherData();
    });

    const setDefaultLocation = document.getElementById("setDefaultLocation");
    setDefaultLocation.addEventListener("click", (event) =>{
        event.preventDefault();
        saveDefault();
    });

    loadDefaultWeather();
    
}

const loadDefaultWeather = () => {
    const storedLocation = localStorage.getItem("weatherDefault");
    if(typeof storedLocation !== "string") return;
    //const parsedStoredLocation = JSON.parse(storedLocation);
    console.log(storedLocation);
    //console.log(parsedStoredLocation);
    weatherData(storedLocation);
}

const saveDefault  = () => {
    const userInput = document.getElementById("city").value + "," + document.getElementById("state").value;
    
    console.log(userInput);
    
    if(userInput === ""){
        alert ("Please enter a city and state");
        
    } else {
        localStorage.setItem("weatherDefault", userInput);
    }  
    
} 



//test to see what data is returned from API call
const weatherData = async(weatherString) => {
    let cityName = "";
    let stateCode = "";
    const countryCode = "US";
    

    if(weatherString){
        cityName = weatherString.slice(0, weatherString.indexOf(','));
        console.log(cityName);
    }else{
        cityName = getCurrentCityName();
    }
    if(weatherString){
        stateCode = weatherString.slice(weatherString.indexOf(',')+1);
        console.log(stateCode);
    }else{
        stateCode = getCurrentStateCode();
    } 

    document.getElementById("currentCityName").textContent = cityName + ", " + stateCode;
    
    let getWeatherData = "";
    getWeatherData = await fetch(`${URL}q=${cityName},${stateCode},${countryCode}&units=${units}&appid=${API_KEY}`);
    let jsonGetWeatherData = await getWeatherData.json();
    let latitude = jsonGetWeatherData.coord.lat;
    let longitude = jsonGetWeatherData.coord.lon;
    getFiveDayForecast(latitude, longitude);
    updateCurrentWeatherHTMLFields(jsonGetWeatherData);
    
    return jsonGetWeatherData; 
   
}
    
    const getFiveDayForecast = async (lat, lon) =>{
        const getFiveDayForecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&&appid=${API_KEY}`)
        const jsonGetFiveDayForecast = await getFiveDayForecast.json();
        updateFiveDayForecastHTMLFields(jsonGetFiveDayForecast);
        return jsonGetFiveDayForecast;
    
    }
    
  const updateCurrentWeatherHTMLFields = (jsonGetWeatherData)=> {
    
    let cityDesc = jsonGetWeatherData.weather[0].description;
    let weatherIcon = document.getElementById("currentCityWeatherIcon");
    let cityTemp = Math.round(jsonGetWeatherData.main.temp);
    let cityFeelsLike = Math.round(jsonGetWeatherData.main.feels_like);
    let tempHigh = Math.round(jsonGetWeatherData.main.temp_max);
    let tempLow = Math.round(jsonGetWeatherData.main.temp_min);
    let humidity = Math.round(jsonGetWeatherData.main.humidity);
 
    
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${jsonGetWeatherData.weather[0].icon}.png" alt="icon for the local weather">`;
    document.getElementById("currentCityDescription").textContent = cityDesc;
    document.getElementById("currentCityTemp").innerText = `Temp: ` + cityTemp + "°F";
    document.getElementById("currentCityFeelsLike").textContent = 'Feels Like: ' + cityFeelsLike + "°F";
    document.getElementById("currentCityHigh").textContent = 'High: ' + tempHigh + "°F";
    document.getElementById("currentCityLow").textContent = 'Low: ' + tempLow + "°F";
    document.getElementById("currentCityHumidity").textContent = 'Humidity: ' + humidity;
}
   
    

const updateFiveDayForecastHTMLFields = (jsonGetFiveDayForecast) => {
    const todayPlus1Date = new Date(jsonGetFiveDayForecast.daily[0].dt);
    
    console.log(todayPlus1Date.toUTCString().substring(0,3));

    for (i = 1; i < 6; i++){
        
        const dateObj = new Date(jsonGetFiveDayForecast.daily[i].dt * 1000);
        const dailyHigh = Math.round(jsonGetFiveDayForecast.daily[i].temp.max);
        const dailyLow = Math.round(jsonGetFiveDayForecast.daily[i].temp.min);
        document.getElementById(`day${i}`).innerHTML = dateObj.toUTCString().substring(0,3);
        document.getElementById(`day${i}Icon`).innerHTML = `<span><img src="https://openweathermap.org/img/wn/${jsonGetFiveDayForecast.daily[i].weather[0].icon}.png" alt="icon for the 5 day forecast"></span>`;
        document.getElementById(`day${i}High`).innerHTML = `High: ${dailyHigh}`  + "°F";
        document.getElementById(`day${i}Low`).innerHTML = `Low: ${dailyLow}`  + "°F";
    
    }
   
    
}

const getCurrentCityName = () => {
   
    return document.getElementById("city").value.trim();
}

const getCurrentStateCode = () => {
   
    return document.getElementById("state").value.trim();
}

const clearItemEntryField = () => {
    
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";

}

const updatePersistentData = (listArray) => {
    localStorage.setItem("weatherDefault", JSON.stringify(listArray));
}