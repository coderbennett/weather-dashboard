var searchSideBarEl = $("#searchSideBar");
var todaysWeatherEl = $("#todaysWeather");
var fiveDayForecastEl = $("fiveDayForecast");
var previousSearchResultsEl = $("previousSearchResultsEl");
var searchInputEl = $("#searchInput");
var searchBtnEl = $("#searchBtn");
var weatherResultsEl = $("weatherResults");

//weather dashboard with search text input form
//take input from user (city name) convert this to
//a lat long to find the weather- we can use the 
//geocoding api for this 



searchBtnEl.on("click", function() {
    if(searchInputEl.val()) {
        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + searchInputEl.val() + '&limit=1&appid=8217350ca23bcfb8f4c4be20b0d654bd')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var lat;
    var long;
  });
    }
})

//upon successful search we should do multiple tasks
    //create a button for the city we searched for
        //probably store this in local storage 
    //display today's weather data for the city
        //icon presenting today's weather
        //temperature fahrenheit
        //humidity
        //wind speed
        //uv index
            //color presenting favorable, moderate or severe green yellow red
    //5-day forecast
        //date x/xx/xxxx
        //weather icon
        //temperature fahrenheit
        //humidity