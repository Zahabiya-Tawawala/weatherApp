// ENCAPSULATING ALL WEATHER FUNCTION RREALTED FUNTIONS IN ONE
// FETCHING OF DATA OF CURRENT WEATHER WITH THE HELP OF WEATHER API
// 1ST FUNCTION ALLOWS US TO FETCH WEATHER WITH API IN CONSOLE
let weather = {
    "apikey": "b8564143472b9e93d89864791bce0898",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apikey
        ).then((Response) => Response.json())
            .then((data) => this.displayWeather(data));
    },
    // MAKING  A FUNCTION TO DISPLAY THE CURRENT WEATHER (OBJECT DISPLAY WEATHER) 
    //EXTRACTING VALUE FROM OBJECTS ASSIGNING THEM TO VARIABLES ALSO CALLED DESTRUCTING ASSIGNMENT
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        console.log(name, icon, description, temp, humidity, speed);

        //THIS CODE HELPS IN  UPDATING THE WEATHER INFORMATION WITH THE DEFAULT ONE 
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".weather-cond").innerText = description;
        document.querySelector(".temp").innerHTML = "<span class='temp'>" + temp + "°C</span>";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".windspeed").innerText = "Windspeed: " + speed + "km/hr";

        //DISPLAYING CURRENT DATE AND TIME
        const dateTimeTag = document.querySelector(".date-time");
        const currentDate = new Date();
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        dateTimeTag.innerText = "Date and Time: "+ formattedDate;
    },

    searchWeather: function searchWeather() {
        const searchInput = document.getElementById("searchInput");
        const city = searchInput.value;
        
        if (city) {
            weather.fetchWeather(city);
            searchInput.value = "";
        } 
        else {
            alert("Please enter a city name");
        }
    },
    
    handleKeyPress: function handleKeyPress(event) {
        if(event.key === "Enter"){
            this.searchWeather();
        }
    }

}
 //GEOCODE OBJECT WHICH CONTAINS MULTIPLE FUNCTIONS 
let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var api_key = 'a71196778eb84234b1200981ed2e5cc2';
        var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ' , ' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    
    if (request.status === 200){
      // Success!
      var data = JSON.parse(request.responseText);
      weather.fetchWeather(data.results[0].components.city);

    } else if (request.status <= 500){
      // We reached our target server, but it returned an error

      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");
  };

  request.send();  // make the request
    },
    
    getLocation: function(){
       function success (data){
          geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
       } 
        // in some browzers this location may not be available hence making a condition for it weather the browzer supports or not
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else{
            weather.fetchWeather("Delhi");
        }
       
    }
};
geocode.getLocation();


// 6 DAYS FORECASTING CREATING A FUNCTION TO CALL CITY NAME
function GetInfo() {
    const newName = document.getElementById("cityInput");
    const cityName = document.getElementById("cityName");
  
    if (newName && cityName) {
      cityName.innerText = "City: " + newName.value;
  
      fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + newName.value+"&units=metric&cnt=6&appid=0ecffc50582a22f101f5a86e6ef9bf75")
        .then(response => response.json())
        .then(data => {
          for (let i = 0; i < 6; i++) {
            const tempElement = document.querySelector(".i" + (i + 1));
            const weaconElement = document.querySelector(".weacon" + (i + 1));
  
            if (tempElement) {
              tempElement.innerText = "Temp: " + Number(data.list[i].main.temp) + "°C";
            }
  
            if (weaconElement) {
              weaconElement.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
            }
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  }
  