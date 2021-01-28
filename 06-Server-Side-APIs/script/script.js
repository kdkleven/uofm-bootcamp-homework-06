

var APIkey = "1c0d3dc2df97a78b630d4385a864717d";
var cities = [];
var date = moment().format("l");

$('#submit').on("click", function (event) {
    event.preventDefault();

    var city = $('#searchInput').val().trim();

    cities.push(city);
    console.log(cities);

    findWeather(city);
    //showWeather();
    renderHistory();
    saveSearch(cities);
});

function renderHistory() {
    $('.historyDiv').empty();
    //$('.historyDiv').text("HISTORY LIST");


}

function saveSearch(cities) {
    localStorage.setItem("history", cities);
}

function findWeather(city) {

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&cnt=5&appid=" + APIkey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    })
        .then(function (weatherResponse) {

            console.log(weatherResponse);

            var latitude = weatherResponse.coord.lat;
            var longitude = weatherResponse.coord.lon;
            var uviURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIkey;
            var uvIndex = "";

            calculateUV(uviURL, uvIndex);

            // Declare variables to display on the main card
            var cardTitleEl = $('#mainCardTitle').html(city + " " + "(" + date + ")");
            cardTitleEl.css("font-size: 20px");
            var tempEl = $('#temperature').html("Temperature: " + Math.floor(weatherResponse.main.temp) + "&deg");
            var humidEl = $('#humidity').html("Humidity: " + Math.floor(weatherResponse.main.humidity) + "&deg");
            var windEl = $('#wind').html("Wind Speed: " + weatherResponse.wind.speed + " mph");
            var uviEl = $('#uvi').html("UV Index: " + uvIndex);

            // Display values on main card
            $('#mainCardTitle').prepend(cardTitleEl);
            $('#mainCardDetails').append(tempEl, humidEl, windEl, uviEl);

            getForecast(forecastURL);

        });
}

// Calculate and return UV index
function calculateUV(uviURL, uvIndex) {
    $.ajax({
        url: uviURL,
        method: "GET",
    })
        .then(function (uviResponse) {
            console.log("before: " + uviResponse.value);
            uvIndex = uviResponse.value;
            return (uvIndex);
        });
}

function getForecast(forecastURL) {

    

    // Call for 5-day forecast
    $.ajax({
        url: forecastURL,
        method: "GET",
    })
        .then(function (forecastResponse) {
            console.log(forecastResponse.list);
       
        });
}