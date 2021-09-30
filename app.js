require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

function cap(word) {
  return (word.charAt(0).toUpperCase() + word.slice(1));
}

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;
  
  https.get(url, function (response) {
    console.log("statusCode:", response.statusCode);
    
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const tempFeelsLike = weatherData.main.feels_like;
      const discription = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const tempMin = weatherData.main.temp_min;
      const tempMax = weatherData.main.temp_max;
      const icon = weatherData.weather[0].icon;
      const weatherImage = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write(`<!DOCTYPE html>
                  <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
                        <link rel="stylesheet" href="/css/info.css">

                    </head>
                    <body>
                      <div class="w-1/2 mx-auto font-sans main-box align-middle mt-28 p-6 shadow-lg rounded-lg">
                          
                        <div class="col-span-3 text-2xl px-3 py-0 title">Current weather in ${cap(query)}</div>
                  
                        <div class="grid grid-cols-1 ">
                          <div class="ml-3">
                            <img src="${weatherImage}" alt="" class="inline w-36 weather-image">
                            <span class="text-7xl mt-39 temp">${Math.round(temp)}°C</span>
                          </div>
                          <div class=" feels">Feels like ${Math.round(tempFeelsLike)}°C, ${discription}</div>
                        </div>
                  
                        <div class="grid grid-cols-1 ">
                          <div class="space-x-3 extra">
                            <img class="w-10 inline-block my-1" src="./images/humidity.png" alt="humidity-icon">
                            <span class="align-middle inline-block">Humidity: ${humidity}%</span> 
                          </div>
                          <div class="space-x-3 extra">
                            <img class="w-10 inline my-1" src="/images/anemometer.png" alt="humidity-icon">
                            <p class="align-middle inline leading-5">Wind speed: ${windSpeed}km/h</p>
                          </div>
                          <div class=" space-x-3 extra">
                            <img class="w-10 inline my-1" src="/images/high-temperature.png" alt="humidity-icon">
                            <span class="align-middle inline">Max. temperature: ${tempMax}°C</span>
                          </div>
                          <div class=" space-x-3 extra">
                            <img class="w-10 inline my-1" src="/images/low-temperature.png" alt="humidity-icon">
                            <span class="align-middle inline">Min. temperature: ${tempMin}°C</span>
                          </div>
                        </div>
                      </div>
                      <form action="/" method="get">
                        <center><button type="submit" class="w-1/2 shadow-lg rounded-md search-again">Search again!</button><center>
                      </form>
                  </body>
                  </html>`);
      res.send();

    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);


// app.listen(3000, function () {
//   console.log("I am port 3000");
// });
