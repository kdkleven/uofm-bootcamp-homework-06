

var APIkey = "1c0d3dc2df97a78b630d4385a864717d";
var searchHistory = [];
var date = moment().format("l");

$('#submit').on("click", function (event) {
    event.preventDefault();
    $('.card-text').html = "";
    $('.card-body').html = "";
    $('<img>').html = "";
    $('<h3>').html = "";
    $('.currentCard').html = "";

    var search = $('#searchInput').val().trim();
    
    searchHistory.push(search);
    console.log(searchHistory);

    searchWeather(search);
    saveSearch(searchHistory);
    //showWeather();
    
});

function searchWeather(search) {
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
            
            $('#todayTitle').html("Current Weather");

            // Declare variables to display on the main card            
            $('#mainCardTitle').html(search + " " + "(" + date + ")");
            $('#mainIcon').attr("src", iconURL);
            $('#temperature').html("Temperature: " + Math.floor(weatherResponse.main.temp) + "&deg");
            $('#humidity').html("Humidity: " + Math.floor(weatherResponse.main.humidity) + "&deg");
            $('#wind').html("Wind Speed: " + weatherResponse.wind.speed + " mph");

            calculateUV(latitude, longitude);
            getForecast(latitude, longitude);

        });
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
           console.log(forecastResponse);

            for (var i = 0; i < 5; i++) {
                fDate = moment.unix(forecastResponse.daily[i].dt).format('l');
                fIcon = forecastResponse.daily[i].weather[0].icon;
                fTemp = forecastResponse.daily[i].temp.day;
                fHumid = forecastResponse.daily[i].humidity;

                var iconURL = "http://openweathermap.org/img/wn/" + fIcon + ".png";                
                
                $('#dayicon-'+ i).attr("src", iconURL);
                $('#fcDate-' + i).html(fDate);
                $('#fcTemp-' + [i]).html("Temp: " + Math.floor(fTemp) + "&deg");
                $('#fcHumid-' + [i]).html("Humid: " + Math.floor(fHumid) + "&deg");

            }
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