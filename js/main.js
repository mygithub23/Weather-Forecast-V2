$(function () {
  const form = document.querySelector("#searchForm");
  const input = document.querySelector(".form-section input");
  const msg = document.querySelector(".form-section .msg");
  const myCityName = document.querySelector("#myCityName");
  

  var cityRes = {};
  var weatherData ={};
  var iconUrl = "http://openweathermap.org/img/wn/";
  //var iconLink = "http://openweathermap.org/img/wn/"
  var lat = 0.0;
  var lon = 0.0;
  var cityName = "";
  var state_code = "";
  var country_code = "";
  var formattedCityName = "";
  var appid = "345fb44947503a9fb445dfe861d317af";
  var units = "imperial";
 

  function convertDate(unixDate) {
    const dateObject = new Date(unixDate * 1000);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const currentDate = month + "/" + day + "/" + year;
    console.log(`toDateString: ${dateObject.toDateString()}`)
    return currentDate;
  }
  class FormatDate {
    constructor(unixDate) {
      this.dateObject = new Date(unixDate * 1000);
    }
    todayDate() {
      return this.dateObject.toDateString();
    }
    year() {
      return this.dateObject.getFullYear();
    }
    month() {
      return this.dateObject.getMonth();
    }
    day() {
      return this.dateObject.getDay();
    }
    date() {
      return this.dateObject.getDate();
    }
    toLocalDate(){
      return this.dateObject.toLocaleDateString();
    }
  }

  // --------------------- Get city coordinates Latitude and Longtitude

  const fetchCityCoordinates = async () => {
    var cityName = input.value;
    
    var url1 = `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=d78200236cec4462bbae6b69a3605fb9&countrycode=US&no_depupe=1&no_annotations=1`
    var url2 = "https://api.opencagedata.com/geocode/v1/json?q=Boston&key=d78200236cec4462bbae6b69a3605fb9&countrycode=US&no_depupe=1&no_annotations=1"
    try {
      const res = await axios.get(url1) 
      cityRes = res.data.results[0];
      lat = cityRes.geometry.lat;
      lon = cityRes.geometry.lng;
      city = cityRes.components.city;
      state_code = cityRes.components.state_code;
      country_code = cityRes.components.country_code;
      formattedCityName = cityRes.formatted;
  
      console.log(`Latitude: ${lat}`);
      console.log(`Longtitude: ${lon}`);
      
  //url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityObj.getlatitude()}&lon=${cityObj.getlongtitude()}&exclude=hourly,minutely&appid=${cityObj.getappid()}&units=${cityObj.getunits()}`
     url = "https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely&appid=345fb44947503a9fb445dfe861d317af"
     url =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${appid}&units=${units}`
      console.log(`query URL: 
                    ${url}`)
    try {
      const resW = await axios.get(url);
      console.log(`This is my Weather Data: 
                  ${resW}`);

      weatherData = resW;
       
    } catch (err) {
      console.log("fetchWeather Error -->", err);
    }
      
      
    } catch (error) {
      console.log("Error----> ", error);
    }

    myCityName.textContent = formattedCityName;
    return weatherData.data;

  };

  // --------------------------- Get city weayther data
  

  // ------------------------------- Build HTML page
  function buildPage(weatherData) {
    let markupArray = [];
    class WeatherCard {
      constructor(i) {
        this.date = new FormatDate(weatherData.daily[i].dt);
        this.temp = weatherData.daily[i].temp.day;
        this.wind = weatherData.daily[i].wind_speed;
        this.uvi = weatherData.daily[i].uvi;
        this.src = this.iconSrc();
        this.alt = this.iconAlt();
      }
      iconSrc() {
        return `${iconUrl}${weatherData.daily[i].weather[0].icon}@2x.png`;
      }
      iconAlt() {
        return `${weatherData.daily[i].weather[0].description}`;
      }
    }

    try {
      var elm = document.querySelector(".daily");

      $(elm).empty();
    } catch (error) {
      alert(error);
    }
    //<h5>${convertDate(data.daily[i].dt)}</h5>
    var card = [];
    for (i = 0; i < 6; i++) {
      card[i] = new WeatherCard(i);
    }

    for (i = 0; i < 6; i++) {
      console.log(card[i]);
    }
    // Next five days forcast
    for (i = 0; i < 6; i++) {
      let todayDate = new FormatDate(weatherData.daily[i].dt);
      console.log(`todayDate: ${todayDate.todayDate()}`)
      
      markupArray[i] = `               
                      <div class="card-body shadow">
                      <h5>${todayDate.todayDate()}</h5> 
                          <hr>                                       
                          <div class="card-text"><svg class="Icon--icon--2AbGu Icon--actionTheme--2vSlg DetailsTable--icon--34dUa" theme="action" set="current-conditions" name="feels-like" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><path d="M9.94 15.406v.323c.974.358 1.671 1.325 1.671 2.461 0 1.441-1.122 2.61-2.505 2.61-1.384 0-2.506-1.169-2.506-2.61 0-1.136.697-2.103 1.67-2.461v-.323a2.088 2.088 0 0 1-1.252-1.914V5.488a2.088 2.088 0 1 1 4.176 0v8.004c0 .856-.516 1.592-1.253 1.914zM9.15 4.9a.75.75 0 0 0-.75.75v5.33h1.5V5.65a.75.75 0 0 0-.75-.75zM15.4 8a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6zm0-1.8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path></svg>
                          ${weatherData.daily[i].temp.day} <sup>°F</sup></div>
                          <div class="card-text"><svg class="Icon--icon--2AbGu Icon--actionTheme--2vSlg DetailsTable--icon--34dUa" theme="action" set="current-conditions" name="humidity" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11.743 17.912a4.182 4.182 0 0 1-2.928-1.182 3.972 3.972 0 0 1-.614-4.962.743.743 0 0 1 .646-.349c.234 0 .476.095.66.275l4.467 4.355c.385.376.39.998-.076 1.275a4.216 4.216 0 0 1-2.155.588M11.855 4c.316 0 .61.14.828.395.171.2.36.416.562.647 1.857 2.126 4.965 5.684 4.965 8.73 0 3.416-2.85 6.195-6.353 6.195-3.505 0-6.357-2.78-6.357-6.195 0-3.082 2.921-6.406 4.854-8.605.242-.275.47-.535.673-.772A1.08 1.08 0 0 1 11.855 4"></path></svg>
                          ${weatherData.daily[i].humidity}</div>
                          <div class="card-text"><svg arialabel="Wind" class="Icon--icon--2AbGu Icon--actionTheme--2vSlg DailyContent--windIcon--35FOj" theme="action" set="current-conditions" name="wind" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><path d="M6 8.67h5.354c1.457 0 2.234-1.158 2.234-2.222S12.687 4.4 11.354 4.4c-.564 0-1.023.208-1.366.488M3 11.67h15.54c1.457 0 2.235-1.158 2.235-2.222S19.873 7.4 18.54 7.4c-.747 0-1.311.365-1.663.78M6 15.4h9.389c1.457 0 2.234 1.159 2.234 2.223 0 1.064-.901 2.048-2.234 2.048a2.153 2.153 0 0 1-1.63-.742" stroke-width="2" stroke="currentColor" stroke-linecap="round" fill="none"></path></svg> 
                          ${weatherData.daily[i].wind_speed}mph</div>
                          <div class="card-text"><svg class="Icon--icon--2AbGu Icon--actionTheme--2vSlg DetailsTable--icon--34dUa" theme="action" set="current-conditions" name="uv" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><path d="M7.4 5.598a.784.784 0 0 1 .25-.92c.335-.256.824-.197 1.02.062.066.063.066.063.08.085l2.406 3.152-.626.238a3.983 3.983 0 0 0-1.097.633l-.522.424L7.4 5.598zm4.539 2.358c-.21 0-.418.017-.625.05l-.664.106.09-.666.438-3.266c.013-.072.013-.072.012-.057a.783.783 0 0 1 .666-.616.78.78 0 0 1 .872.639l.006.038.507 3.933-.662-.108a3.957 3.957 0 0 0-.64-.053zm-7.781 3.19l.026-.004 3.934-.507-.108.662a3.98 3.98 0 0 0-.003 1.266l.105.664-.665-.09-3.265-.439a.784.784 0 0 1-.676-.679c-.054-.42.238-.809.63-.869l.022-.004zm11.504-.617a3.98 3.98 0 0 0-.632-1.097l-.425-.522.623-.256 3.056-1.256a.787.787 0 0 1 .916.253c.256.337.199.817-.104 1.063l-.045.037-3.151 2.405-.238-.627zm-1.205-1.672a3.984 3.984 0 0 0-1.095-.637l-.626-.24.41-.532 2.008-2.602c.059-.07.059-.07.046-.052a.78.78 0 0 1 1.306.227c.076.185.079.39.02.54l-.021.06-1.528 3.662-.52-.426zM4.595 7.793c.162-.387.611-.58.971-.441.017.004.017.004.055.02L9.283 8.9l-.425.52a3.985 3.985 0 0 0-.636 1.094l-.24.627-3.144-2.425a.784.784 0 0 1-.243-.924zm14.443 7.367c.054.045.054.045.044.04a.784.784 0 0 1 .199.884c-.163.386-.61.58-.964.443-.024-.006-.024-.006-.062-.022l-3.662-1.529.426-.52a3.98 3.98 0 0 0 .636-1.094l.241-.626 3.142 2.424zm1.332-3.303c.053.422-.239.809-.63.87l-.035.006-3.945.508.108-.662a3.999 3.999 0 0 0 .003-1.266l-.105-.663.665.09 3.272.44c.068.012.068.012.052.01a.784.784 0 0 1 .615.667zm-3.894 6.421c.024.068.024.068.017.053a.786.786 0 0 1-.27.87c-.332.25-.816.194-1.047-.091-.022-.023-.022-.023-.05-.058l-2.406-3.154.626-.237a3.977 3.977 0 0 0 1.097-.632l.523-.425 1.51 3.674zm-8.26-4.932c.151.397.365.767.633 1.097l.424.522-.622.256-3.054 1.255a.787.787 0 0 1-.92-.25.781.781 0 0 1-.154-.58c.027-.199.127-.379.227-.452.045-.046.045-.046.075-.069l3.153-2.406.238.627zm3.723 2.572c.209 0 .417-.016.625-.049l.662-.103-.089.664-.438 3.26-.012.062a.785.785 0 0 1-.666.618c-.048.005-.048.005-.101.006-.386 0-.714-.28-.764-.612-.01-.043-.01-.043-.014-.072l-.507-3.934.662.108c.213.035.427.052.642.052zM7.366 18.27l.006-.015L8.9 14.592l.52.426a3.99 3.99 0 0 0 1.094.636l.626.241-.41.531-2.012 2.609-.04.046a.788.788 0 0 1-.886.2.787.787 0 0 1-.428-1.011z"></path><path d="M11.911 14.322a2.411 2.411 0 1 0 0-4.822 2.411 2.411 0 0 0 0 4.822zm0 2a4.411 4.411 0 1 1 0-8.822 4.411 4.411 0 0 1 0 8.822z"></path></svg>
                          ${weatherData.daily[i].uvi} of 10</div>
                          <figure>
                        <img class="city-icon" src=${iconUrl}${weatherData.daily[i].weather[0].icon}@2x.png alt=${weatherData.daily[i].weather[0].description}>
                        <figcaption>${weatherData.daily[i].weather[0].description}</figcaption>
                      </figure>            
                      </div>
                    
                    `;
    }

    //  <div class="shadow col-sm bg-warning">  </div>

    for (i = 0; i < markupArray.length; i++) {
      $(markupArray[i]).appendTo(".daily");
    }
    $(".shadow").css({
      "-webkit-box-shadow": "3px 3px 5px 6px #ccc",
      "-moz-box-shadow": "3px 3px 5px 6px #ccc",
      "box-shadow": "3px 3px 5px 6px #ccc",
    });
    $(".card-text").css({
      "font-size": "16px",
      "font-weight": "bold",
      "margin-top": "5px",
    });
    $(".card-text svg").css({
      width: "18px",
      height: "18px",
      fill: "#1b4de4",
      color: "#1b4de4",
    });
  }

  //-------------------- Form event listner

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    
   weatherData = await fetchCityCoordinates();
   console.log(`MY weather Data: 
              ${weatherData}`)
   buildPage(weatherData); 
   

  

      

    //-------------------------------------

    
    // //--------------------------------------------------

   // var weatherData = await fetchWeatherInfo();
    // icon = "http://openweathermap.org/img/wn/";
   // buildPage(weatherData, icon);

    form.elements.mycity.value = "";
    // }    
    
  // };
});
  });
