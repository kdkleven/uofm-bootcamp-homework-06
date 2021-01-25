

var APIkey = "1c0d3dc2df97a78b630d4385a864717d";
var cities = [];
var date = moment();

$('#searchEl').on("click", function(event){
    event.preventDefault();

    var city = $('#cityEl').val().trim();
    
    cities.push(city);
   
    showWeather();
})

function renderHistory () {
    $('.historyDiv').empty();

    
}

function showWeather() {

    city = $(this).data('city');

    var weatherURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    var forecastURL = "api.openweathermap.org/data/2.5/forecast?q=" + input + "&appid=" + APIkey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    })
    .then(function(weatherResponse) {

        console.log(weatherResponse);


    })

    $.ajax({
        url:forecastURL,
        method: "GET"
    })
    .then(function(forecastResponse) {
        console.log(forecastResponse);

    })

}

