var searchSideBarEl = $("#searchSideBar");
var todaysWeatherEl = $("#todaysWeather");
var fiveDayForecastEl = $("fiveDayForecast");
var previousSearchResultsEl = $("#previousSearchResults");
var searchInputEl = $("#searchInput");
var searchBtnEl = $("#searchBtn");
var weatherResultsEl = $("weatherResults");

//weather dashboard with search text input form
//take input from user (city name) convert this to
//a lat long to find the weather- we can use the 
//geocoding api for this 

var currentCity;

if(localStorage.getItem("citiesArray") === null) {
    localStorage.setItem("citiesArray", JSON.stringify([]));
} 

// initialize the searched cities array from the local storage
var searchedCities = JSON.parse(localStorage.getItem("citiesArray"));

//now that we have our cities from the local storage, we can display them.
displaySearchedCities();

//if there are no elements with the citybtn class don't listen for them
//if there are, listen for a click event to show the weather results
if($(".cityBtn")){
    $(".cityBtn").on("click", function() {
        var clicked = $(this);
        currentCity = searchedCities[clicked.attr("index")];
        showWeatherResults(currentCity);
    });
}

// this is an on click event listener for the search button
searchBtnEl.on("click", function() {
    //if the searchinput has any value
    if(searchInputEl.val()) {
        //fetch the api geocoding for the city they typed in
        fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + searchInputEl.val() + '&limit=1&appid=8217350ca23bcfb8f4c4be20b0d654bd')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
        // create an object with the name of the city, the latitude
        // and the longitude
        var cityObj = {
            name: data[0].name,
            lat: data[0].lat,
            lon: data[0].lon
        }
        currentCity = cityObj;
        //clear the list of searched cities
        clearSearchedCitiesList();

        // add the newly added city to the front of the array
        searchedCities.unshift(cityObj);

        //the reason we have the searched index is to keep the list of
        //cities from becoming too large, if we reach 10 cities
        //we will go back to 0 and replace the first city
        //and continue to loop through the list replacing each
        //previous city
        searchedIndex++;
        if(searchedCities.length > 9) {
            searchedCities.pop();
        }
        localStorage.setItem("citiesArray", JSON.stringify(searchedCities));
        displaySearchedCities();
        showWeatherResults(currentCity);
        });
    }
});

//this function displays all the cities which
//have been stored into local storage
function displaySearchedCities() {

    for (var i = 0; i < searchedCities.length; i++) {
        var tempCityBtnEl = $('<li>');
        tempCityBtnEl.text(searchedCities[i].name);
        tempCityBtnEl.addClass("cityBtn");
        tempCityBtnEl.attr("index", i);
        previousSearchResultsEl.append(tempCityBtnEl);
    
    }

}

// this function checks if there are cities to clear, then
//clears the list of cities
function clearSearchedCitiesList() {

    if (previousSearchResultsEl.children.length) {
        previousSearchResultsEl.children().remove();
    }

}

function showWeatherResults(cityObj) {
    weatherResultsEl.attr("style", "display:block");

    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + cityObj.lat + '&lon=' + cityObj.lon + '&appid=8217350ca23bcfb8f4c4be20b0d654bd')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })

}

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