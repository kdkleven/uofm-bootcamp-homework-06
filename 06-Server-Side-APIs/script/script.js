

var APIkey = "1c0d3dc2df97a78b630d4385a864717d";
var date = moment().format("l");
var entry = "";

$('#submit').click(function (event) {
    event.preventDefault();

    var search = $('#searchInput').val().trim();

    if (search === "" || search === null) {
        return;
    }
  
    $('.todayDiv').removeClass('hidden');
    $('.forecastDiv').removeClass('hidden');

    searchWeather(search);
    saveSearch(search);
    renderHistory();
});

$(".historyList").on("click", ".historyBtn", function(){
    console.log("clicked");
    searchWeather($(this).text().trim());
 
});

// call openweathermap APIs to get weather
function searchWeather(search) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&units=imperial&appid=" + APIkey;

    // call weather API to get today's weather
    $.ajax({
        url: weatherURL,
        method: "GET"
    })
        .then(function (weatherResponse) {

            // console.log(weatherResponse);

            var latitude = weatherResponse.coord.lat;
            var longitude = weatherResponse.coord.lon;
            var uviURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIkey;
            var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current+minutely+hourly+alerts&units=imperial&appid=" + APIkey;
            var icon = weatherResponse.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + icon + ".png";

            // Declare variables to display on the main card            
            $('#todayTitle').html("Current Weather");
            $('#mainCardTitle').html(search + " " + "(" + date + ")");
            $('#mainIcon').attr("src", iconURL);
            $('#temperature').html("Temperature: " + Math.floor(weatherResponse.main.temp) + "&deg");
            $('#humidity').html("Humidity: " + Math.floor(weatherResponse.main.humidity) + "&deg");
            $('#wind').html("Wind Speed: " + weatherResponse.wind.speed + " mph");


            // Call uvi API to get UV index    
            $.ajax({
                url: uviURL,
                method: "GET",
                success: function (data) {
                    var uviEl = $('#uvi').html("UV Index: " + data.value);
                    $('.mainCardDetails').append(uviEl);
                }
            });

            // Call onecall API to get 5-day forecast
            $.ajax({
                url: forecastURL,
                method: "GET",
            })
                .then(function (forecastResponse) {

                    for (var i = 0; i < 5; i++) {
                        fDate = moment.unix(forecastResponse.daily[i].dt).format('l');
                        fIcon = forecastResponse.daily[i].weather[0].icon;
                        fTemp = forecastResponse.daily[i].temp.day;
                        fHumid = forecastResponse.daily[i].humidity;

                        var iconURL = "http://openweathermap.org/img/wn/" + fIcon + ".png";

                        $('#dayicon-' + i).attr("src", iconURL);
                        $('#fcDate-' + i).html(fDate);
                        $('#fcTemp-' + [i]).html("Temp: " + Math.floor(fTemp) + "&deg");
                        $('#fcHumid-' + [i]).html("Humid: " + Math.floor(fHumid) + "&deg");

                    }
                });

        });
    }

var savedSearch = [];

// save the current search parameter to local storage and display a corresponding button
function saveSearch(searchJSON) {
    
    savedSearch.push(searchJSON);
    
    localStorage.setItem("history", JSON.stringify(savedSearch));
    console.log(savedSearch);
}

// render past searches as buttons on the page
function renderHistory() {
    $('#searchInput').val('');
    
    var lastSearch = JSON.parse(localStorage.getItem("history"));
    var renderBtn = $('<button>').attr('type', 'button');
    renderBtn.attr('class', 'btn btn-light historyBtn');
    renderBtn.css("margin", "5px");

    for (var i = 0; i < savedSearch.length; i++) {
    
        if (lastSearch !== null) {
    
            renderBtn.attr('id', 'historyBtn-' + i);
            renderBtn.html(lastSearch[i]);  
            $('.historyList').append(renderBtn);
        }   
    }
    entry = "";
}

// display buttons for past searches (if they exist)
renderHistory();
