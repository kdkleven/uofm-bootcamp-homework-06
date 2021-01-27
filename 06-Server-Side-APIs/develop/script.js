

var APIkey = "1c0d3dc2df97a78b630d4385a864717d";
var cities = [];
var date = moment().format("l");

$('#submit').on("click", function(event){
    event.preventDefault();

    var city = $('#searchInput').val().trim();

    cities.push(city);
    console.log(cities);
   
    showWeather(city);
    renderHistory();
    //saveSearch(cities);
})

function renderHistory () {
    $('.historyDiv').empty();
    //$('.historyDiv').text("HISTORY LIST");

    
}

function showWeather(city) {    

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIkey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    })
    .then(function(weatherResponse) {

        console.log(weatherResponse);

        var latitude = weatherResponse.coord.lat;
        var longitude = weatherResponse.coord.lon;
        var uviURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIkey;
    
        $.ajax({
            url: uviURL,
            method: "GET",
            async: false
        })
        .then(function(uviResponse) {
            console.log(uviResponse.value); 
        })
            
        var cardTitleEl = $('#mainCardTitle').html(city + " <br> " + date);
        var tempEl = $('#temperature').html("Temperature: " + Math.floor(weatherResponse.main.temp) + "&deg");
        var humidEl = $('#humidity').html("Humidity: " + Math.floor(weatherResponse.main.humidity) + "&deg");
        var windEl = $('#wind').html("Wind Speed: " + weatherResponse.wind.speed + " mph");
        var uviEl = $('#uvi').html("UV Index: ");

        $('#mainCardTitle').prepend(cardTitleEl);
        $('#mainCardDetails').append(tempEl, humidEl, windEl, uviEl);

        $.ajax({
            url:forecastURL,
            method: "GET",
            async: false
        })
        .then(function(forecastResponse) {
            console.log(forecastResponse);
            var forecast = moment(forecastResponse.list[1].dt).format('l')
            for (var i = 0; i < 6; i++) {
                console.log(forecast);
            }
        })
    })

    

}