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

if(localStorage.getItem("citiesArray") === null) {
    localStorage.setItem("citiesArray", JSON.stringify([]));
    localStorage.setItem("searchedIndex", "0");
} 

var searchedCities = JSON.parse(localStorage.getItem("citiesArray"));
var searchedIndex = JSON.parse(localStorage.getItem("searchedIndex"));
displaySearchedCities();

if($("#cityBtn")){
    $("#cityBtn").on("click", showWeatherResults());
}

searchBtnEl.on("click", function() {
    if(searchInputEl.val()) {
        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + searchInputEl.val() + '&limit=1&appid=8217350ca23bcfb8f4c4be20b0d654bd')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var cityObj = {
        name: data[0].name,
        lat: data[0].lat,
        lon: data[0].lon
    }
    console.log(searchedCities);
    searchedCities.unshift(cityObj);


    //the reason we have the searched index is to keep the list of
    //cities from becoming too large, if we reach 10 cities
    //we will go back to 0 and replace the first city
    //and continue to loop through the list replacing each
    //previous city
    searchedIndex++;
    if(searchedIndex === 10) {
        searchedCities.pop();
    }
    localStorage.setItem("searchedIndex", searchedIndex);
    clearSearchedCitiesList();
    displaySearchedCities();
  });
    }
})

function displaySearchedCities() {

    for (var i = 0; i < searchedCities.length; i++) {
        var tempCityBtnEl = $("<button>");
        tempCityBtnEl.text(searchedCities[i].name);
        tempCityBtnEl.attr("index", searchedIndex);
        tempCityBtnEl.addClass("cityBtn");
        previousSearchResultsEl.append(tempCityBtnEl);
    
    }

}

function clearSearchedCitiesList() {

    if (previousSearchResultsEl.children.length) {
        for (var i = searchedCities.length; i > 0; i--){
            previousSearchResultsEl.children[i].remove();
        }
    }

}

function showWeatherResults() {
    
}
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