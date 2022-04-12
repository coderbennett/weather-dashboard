var searchSideBarEl = $("#searchSideBar");
var todaysWeatherEl = $("#todaysWeather");
var fiveDayForecastEl = $("#fiveDayForecast");
var previousSearchResultsEl = $("#previousSearchResults");
var searchInputEl = $("#searchInput");
var searchBtnEl = $("#searchBtn");
var weatherResultsEl = $("#weatherResults");

searchInputEl.on("form", pullWeatherData);

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

// this is an on click event listener for the search button
searchBtnEl.on("click", pullWeatherData);

function pullWeatherData() {

    //if the searchinput has any value
    if(searchInputEl.val()) {
        //fetch the api geocoding for the city they typed in
        fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchInputEl.val() + '&limit=1&appid=8217350ca23bcfb8f4c4be20b0d654bd')
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
        clearWeatherResults();

        // add the newly added city to the front of the array
        searchedCities.unshift(cityObj);

        //the reason we have the searched index is to keep the list of
        //cities from becoming too large, if we reach 10 cities
        //we will go back to 0 and replace the first city
        //and continue to loop through the list replacing each
        //previous city
        if(searchedCities.length > 9) {
            searchedCities.pop();
        }
        localStorage.setItem("citiesArray", JSON.stringify(searchedCities));
        displaySearchedCities();
        showWeatherResults(currentCity);
        });
    }
}

//this function displays all the cities which
//have been stored into local storage
function displaySearchedCities() {

    for (var i = 0; i < searchedCities.length; i++) {
        var tempCityBtnEl = $('<li>');
        tempCityBtnEl.text(searchedCities[i].name);
        tempCityBtnEl.addClass("cityBtn");
        tempCityBtnEl.attr("index", i);
        previousSearchResultsEl.append(tempCityBtnEl);
    
        //listen for a click event to show the weather results

    tempCityBtnEl.on("click", function() {
        var clicked = $(this);
        currentCity = searchedCities[clicked.attr("index")];
        clearWeatherResults();
        showWeatherResults(currentCity);
    });
    }

}

// this function checks if there are cities to clear, then
//clears the list of cities
function clearSearchedCitiesList() {

    if (previousSearchResultsEl.children.length) {
        previousSearchResultsEl.children().remove();
    }

}

// this function clears the weather results
// to allow for new results
function clearWeatherResults() {
    weatherResultsEl.css("display", "none");
    todaysWeatherEl.children().remove();
    fiveDayForecastEl.children().remove();
}

// this function takes in a city object and displays the corresponding data
function showWeatherResults(cityObj) {
    weatherResultsEl.css("display", "block");
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + cityObj.lat + '&lon=' + cityObj.lon + '&appid=8217350ca23bcfb8f4c4be20b0d654bd')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //this first section of this function
        //sets all the current weather data
        //-----------------------------------

        //here we set up the main header for the current weather
        var header2 = $("<h4>");
        var today = new Date().toLocaleDateString();
        header2.html(cityObj.name + ' (' + today + ') ' + '<img src=http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png />');
        todaysWeatherEl.append(header2);

        //this creates the temperate element and data
        var temperatureEl = $("<h5>");
        temperatureEl.text("Temperature: " + Math.round((data.current.temp - 273.15)* 9/5 + 32) + " °F");
        todaysWeatherEl.append(temperatureEl);

        //humidity data
        var humidityEl = $("<h5>");
        humidityEl.text("Humidity: " + data.current.humidity + "%");
        todaysWeatherEl.append(humidityEl);

        //wind data
        var windEl = $("<h5>");
        windEl.text("Wind Speed: " + data.current.wind_speed + " MPH");
        todaysWeatherEl.append(windEl);

        //check the UVI and prepare to set a color
        //coded background for it
        var color;
        if ((data.current.uvi) < 3) {
            color = "bg-success";
        } else if ((data.current.uvi) < 8) {
            color = "bg-warning";
        } else {
            color = "bg-danger";
        }

        //UVI data displayed by this code here
        var uvIndexEl = $("<h5>");
        uvIndexEl.html("UV Index: <span class='rounded text-light p-2 " + color + "' > " + (data.current.uvi) + "</span>");
        todaysWeatherEl.append(uvIndexEl);

        //this section sets the 5 day forecast weather data
        //-------------------------------------------------
        for (var i = 1; i < 6; i++) {
            //create a card element for the day at this index
            var tempCardEl = $("<div class='card bg-primary p-6' style='width: 9rem; margin: 6px;'>");
            fiveDayForecastEl.append(tempCardEl);

            //create a body element to contain the data
            var tempCardBodyEl = $("<div class='card-body'>");
            tempCardEl.append(tempCardBodyEl);

            //create date objects to set proper dates
            //for each index
            var todaysDate = new Date();
            var indexDate = new Date();
            indexDate.setDate(todaysDate.getDate() + i);
            indexDate = indexDate.toLocaleDateString();
            var tempCardHeader = $("<h6 class='card-title text-light'>");
            tempCardHeader.text(indexDate);
            tempCardBodyEl.append(tempCardHeader);

            //set the icon image
            var tempCardImg = $("<img>");
            tempCardImg.attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
            tempCardBodyEl.append(tempCardImg);

            //create temperature element
            var tempCardTemperatureEl = $("<p class='text-light'>");
            tempCardTemperatureEl.text("Temp: " + Math.round((data.daily[i].temp.day - 273.15)* 9/5 + 32) + " °F");
            tempCardBodyEl.append(tempCardTemperatureEl);
            
            //create humidity element
            var tempCardHumidityEl = $("<p class='text-light'>");
            tempCardHumidityEl.text("Humidity: " + data.daily[i].humidity + "%");
            tempCardBodyEl.append(tempCardHumidityEl);
        }
    })

}


