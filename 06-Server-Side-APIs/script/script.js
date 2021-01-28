

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
            getForecast(latitude, longitude);

            // Declare variables to display on the main card
            var cardTitleEl = $('#mainCardTitle').html(city + " " + "(" + date + ")");
            cardTitleEl.css("font-size: 20px");
            var sunEl = $('<img>').attr("src","");
            var tempEl = $('#temperature').html("Temperature: " + Math.floor(weatherResponse.main.temp) + "&deg");
            var humidEl = $('#humidity').html("Humidity: " + Math.floor(weatherResponse.main.humidity) + "&deg");
            var windEl = $('#wind').html("Wind Speed: " + weatherResponse.wind.speed + " mph");
            var uviEl = $('#uvi').html("UV Index: " + uvIndex);

            // Display values on main card
            // Ensure UV index is color-coded as favorable, moderate, severe
            // display current day's weather (clouds, sun, rain, snow, etc.)
            $('#mainCardTitle').prepend(cardTitleEl);
            $('#mainCardDetails').append(sunEl, tempEl, humidEl, windEl, uviEl);

            // getForecast(forecastURL);

        });
}

// Calculate and return UV index
function calculateUV(uviURL, uvIndex) {
    $.ajax({
        url: uviURL,
        method: "GET",
        async: false,
    })
        .then(function (uviResponse) {
            console.log("before: " + uviResponse.value);
            uvIndex = uviResponse.value;
            return (uvIndex);
        });
}

function getForecast(latitude, longitude) {

    var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current+minutely+hourly+alerts&units=imperial&appid=" + APIkey;    

    // Call for 5-day forecast
    $.ajax({
        url: forecastURL,
        method: "GET",
    })
        .then(function (forecastResponse) {
            console.log(forecastResponse);

            var forecast = [
                {
                    date: "", weather: "", temp: "", humidity: ""
                },
                {
                    date: "", weather: "", temp: "", humidity: ""
                },
                {
                    date: "", weather: "", temp: "", humidity: ""
                },
                {
                    date: "", weather: "", temp: "", humidity: ""
                },
                {
                    date: "", weather: "", temp: "", humidity: ""
                },
            ]

            for (var i = 0; i < forecast.length; i++) {
                forecast[i].date = moment.unix(forecastResponse.daily[i].dt).format('l');
                forecast[i].weather = forecastResponse.daily[i].weather[0].main;
                forecast[i].temp = forecastResponse.daily[i].temp.day;
                forecast[i].humidity = forecastResponse.daily[i].humidity;

                $('#fcDate-' + [i]).append(forecast[i].date);
                $('#fcWeather-' + [i]).html("src", "placeholder");
                $('#fcTemp-' + [i]).html("Temp: " + Math.floor(forecast[i].temp) + "&deg");
                $('#fcHumid-' + [i]).html("Humid: " + Math.floor(forecast[i].humidity) + "&deg");
                
            }

            console.log(forecast);
       
        });
}