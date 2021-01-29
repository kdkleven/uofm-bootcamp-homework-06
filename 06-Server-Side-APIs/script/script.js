

var APIkey = "1c0d3dc2df97a78b630d4385a864717d";
var searchHistory = [];
var date = moment().format("l");

$('#submit').on("click", function (event) {
    event.preventDefault();
    $('.card-text').html = "";
    $('.card-body').html = "";
    $('<img>').html = "";
    $('<h6>').html = "";
    $('.currentCard').html = "";

    var search = $('#searchInput').val().trim();
    
    searchHistory.push(search);
    console.log(searchHistory);

    findWeather(search);
    //showWeather();
    renderHistory(searchHistory);
    saveSearch(searchHistory);
});

function findWeather(search) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&units=imperial&appid=" + APIkey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    })
        .then(function (weatherResponse) {

           // console.log(weatherResponse);

            var latitude = weatherResponse.coord.lat;
            var longitude = weatherResponse.coord.lon;
            
            var icon = weatherResponse.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + icon + ".png";
            
            $('.mainCardDetails').prepend($('<h3>').html("Today's Weather"));

            var cardTitleEl = $('#mainCardTitle').html(search + " " + "(" + date + ")");
            
            
            // Declare variables to display on the main card
            
            //var todayTitle = $('<h3>').attr({id: "today", value: "Today's Weather"});
            
            var iconEl = $('<img>').attr({ id: "mWeather", src: iconURL });
            var tempEl = $('#temperature').html("Temperature: " + Math.floor(weatherResponse.main.temp) + "&deg");
            var humidEl = $('#humidity').html("Humidity: " + Math.floor(weatherResponse.main.humidity) + "&deg");
            var windEl = $('#wind').html("Wind Speed: " + weatherResponse.wind.speed + " mph");

            saveSearch(cardTitleEl, iconEl, tempEl, humidEl, windEl);
            displayWeather(cardTitleEl, iconEl, tempEl, humidEl, windEl);
            calculateUV(latitude, longitude);
            getForecast(latitude, longitude);

        });
}

function displayWeather(cardTitleEl, iconEl, tempEl, humidEl, windEl) {
    // Display values on main card
    // Ensure UV index is color-coded as favorable, moderate, severe
    // display current day's weather (clouds, sun, rain, snow, etc.)
    $('#mainCardTitle').append(cardTitleEl);
    $('.mainCardDetails').append(iconEl, tempEl, humidEl, windEl);

}

function saveSearch(searchHistory) {
    
    localStorage.setItem("searches", searchHistory);
    renderHistory(searchHistory);

}


function renderHistory(searchHistory) {
    $('.historyDiv').empty();
    $('.historyDiv').text("HISTORY LIST");
    


    // for (var i = 0; i < searchHistory.length; i++) {
    //     localStorage.getItem("searches");   
    //     //$('<button>').attr({id: })
    // }

}

// Calculate and return UV index
function calculateUV(latitude, longitude) {

    var uviURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIkey;

    $.ajax({
        url: uviURL,
        method: "GET",
        success: function (data) {
            var uviEl = $('#uvi').html("UV Index: " + data.value);
            $('.mainCardDetails').append(uviEl);
        }
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
           // console.log(forecastResponse);

            var forecast = [
                {
                    date: "", icon: "", temp: "", humidity: ""
                },
                {
                    date: "", icon: "", temp: "", humidity: ""
                },
                {
                    date: "", icon: "", temp: "", humidity: ""
                },
                {
                    date: "", icon: "", temp: "", humidity: ""
                },
                {
                    date: "", icon: "", temp: "", humidity: ""
                },
            ];

            for (var i = 0; i < forecast.length; i++) {
                forecast[i].date = moment.unix(forecastResponse.daily[i].dt).format('l');
                forecast[i].icon = forecastResponse.daily[i].weather[0].icon;
                forecast[i].temp = forecastResponse.daily[i].temp.day;
                forecast[i].humidity = forecastResponse.daily[i].humidity;

                var iconURL = "http://openweathermap.org/img/wn/" + forecast[i].icon + ".png";
                var imgEl = $('<img>').attr({ id: "#fcWeather-" + [i], src: iconURL });

                $('#fcDate-' + [i]).append(forecast[i].date, imgEl);

                //console.log(iconURL);

                $('#fcTemp-' + [i]).html("Temp: " + Math.floor(forecast[i].temp) + "&deg");
                $('#fcHumid-' + [i]).html("Humid: " + Math.floor(forecast[i].humidity) + "&deg");

            }

            //console.log(forecast);

        });
}