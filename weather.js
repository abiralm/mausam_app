
let cityValue = "kathmandu"

document.getElementById("submit_btn").onclick = function(){
cityValue = document.getElementById("cityName").value;
  fetchData();
}

//enter key fix
let form =document.getElementById("cityName");
form.addEventListener("keypress",function(event){
  if(event.key==="Enter"){ 
    event.preventDefault();
    cityValue = document.getElementById("cityName").value;
    fetchData();
  }
  });

//selectors
let display = document.getElementById("location");
let country = document.getElementById("country")
let temp = document.getElementById("temp");
let condition = document.getElementById("condition");
let humidity = document.getElementById("info_1");
let rain = document.getElementById("info_2");
let wind = document.getElementById("info_3");
let visibility = document.getElementById("info_4");
let img_src = document.getElementById("weather_img");
let days_forecast = document.getElementById("section_forecast");


//fetching
function fetchData(){
  const request1 = fetch(`https://api.weatherapi.com/v1/current.json?key=c63bbf27cb314e92a7d80423231208&q=${cityValue}`).then(response => response.json())
  const request2 = fetch(`http://api.weatherapi.com/v1/forecast.json?key=c63bbf27cb314e92a7d80423231208&q=${cityValue}&days=7&aqi=no&alerts=no`).then(response => response.json())

  Promise.all([request1, request2])
      .then(([data1, data2]) => {
        fillData(data1, data2);
      })
      .catch(error => {
        console.error(error);
      });
}

 

// function that fills in data    
function fillData(resp1,resp2){
  console.log(resp1);
  console.log(resp2);
  display.innerText = `${resp1.location.name}`;
  country.innerText = resp1.location.country;
  temp.innerText = `${resp1.current.temp_c}°C`;
  condition.innerText = resp1.current.condition.text;
  humidity.innerText = `${resp1.current.humidity}%`;
  rain.innerText = `${resp2.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  wind.innerText = `${resp1.current.wind_kph} kmh`;
  visibility.innerText = `${resp1.current.vis_km} km`;

  let a = resp1.current.is_day;
  let b = resp1.current.condition.code;

  img_src.src=weatherImage(a,b);
  forecast_func(resp2);
}

// for weather image
function weatherImage(isDay,code){
  
  console.log(isDay,code) // test
  src = ((isDay==1)&&(code==1000))? "../weather_app/sun.png":
                ((isDay==1))&&(code==1003)? "../weather_app/cloudy.png":
                ((isDay==1)&&(code==1006))? "../weather_app/cloud.png":
                ((isDay==1)&&(code==1009))? "../weather_app/overcast.png":
                ((isDay==1 || isDay==0)&&(code==1030))? "../weather_app/humidity.png":
                ((isDay==1 || isDay==0)&&(code==1063||code==1150||code==1153||code==1180||code==1183||code==1189||code==1195||code==1240))? "../weather_app/rain.png":
                ((isDay==1 || isDay==0)&&(code==1210||code==1213||code==1216||code==1219||code==1222||code==1225))? "../weather_app/snowy.png":
                ((isDay==1 || isDay==0)&&(code==1273||code==1276||code==1279||code==1282||code==1087))? "../weather_app/storm.png":
                ((isDay==1 || isDay==0)&&(code==1135||code==1147))? "../weather_app/wind.png":
                ((isDay==0)&&(code==1000))? "../weather_app/full-moon.png":
                ((isDay==0))&&(code==1003||code==1006||code==1009)? "../weather_app/cloudy-night.png":
                "../weather_app/snowflake.png" ;
  return src;             
}


/* daily forecast */

function forecast_func(resp2) {
  days_forecast.innerHTML = resp2.forecast.forecastday.map(dayy =>
    `<div id="day_forecast">
      <h2  class="footer_text bold_footer">${dayy.date.slice(5)}</h2> 
      <h2 class="footer_text">${dayy.day.condition.text}</h2>
      <img src="${weatherImage(1, dayy.day.condition.code)}" width=20%>
      <h2  class="footer_text bold_footer">${dayy.day.avgtemp_c}°C</h2>
    </div>`
  ).join(''); // Use join('') to concatenate elements without commas
}


fetchData()


