const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const jquery = require("jquery");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  
  const query = req.body.cityName;
  const apiKey = "2b5fdd25e6342b76b0b6ab27a7a0496c";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;
  
  https.get(url, function (response) {
    console.log("statusCode:", response.statusCode);
    
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const discription = weatherData.weather[0].description;

      const icon = weatherData.weather[0].icon;

      const weatherImage = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write("<p>Wheather is " + discription + "</p>");
      res.write(`<h1>The tempreture is ${query} is  ${temp}</h1>`);
      res.write(`<img src='${weatherImage}'>`);

      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("I am port 3000");
});
