const express = require('express');
const request = require('request');
const api_helper = require('./backend/app')
const app = express();

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/getcities', (req, res) => {
  cityName = req.query["city"];
  api_helper.make_API_call('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + cityName + '&types=(cities)&language=en&key=AIzaSyAz-DPdiThQl94iM3GByA4l7uYD47ifDGw')
      .then(response => {
          res.json(response)
      })
      .catch(error => {
          res.send(error)
      })
});

app.get('/getgeocode', (req, res) => {
  streetName = req.query["street"];
  cityName = req.query["city"];
  stateName = req.query["state"];
  params = streetName + "," + cityName + "," + stateName;
  api_helper.make_API_call('https://maps.googleapis.com/maps/api/geocode/json?address=' + params + '&key=AIzaSyAz-DPdiThQl94iM3GByA4l7uYD47ifDGw')
      .then(response => {
          res.json(response)
      })
      .catch(error => {
          res.send(error)
      })
});

app.get('/getstateseal', (req, res) => {
  state = req.query["state"];
  url = 'https://www.googleapis.com/customsearch/v1?q=' + state + '%20State%20Seal&cx=016065621806241521131:a3cj5qp1rsm&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyAYVhtF-bEJCTQcGuay8p_QQ4pLNXFFWmM';

  request.get(url,
      (errorResponse, response, data) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Cache-Control", "no-cache");

          if (errorResponse) {
              res.status(404).send("Error while fetching images from google.");
              return null;
          }
          data = JSON.parse(data);

          if (!data ||
              data === null
          ) {
              res.status(404).send("Error while fetching images from google.");
              return null;
          }

          if (!data.hasOwnProperty("items") ||
              data.items.length <= 0
          ) {
              res.status(404).send("No Records.");
              return null;
          }

          let result = [];

          let items = data.items;
          for (let i = 0; i < items.length; i++) {
              let item = items[i];

              if (item.hasOwnProperty("link") && item.link.length > 0) {
                  result.push(item.link);
              }
          }

          res.send(result);
      });
});

app.get('/getweatherforecastwithtime', (req, res) => {
  lat = req.query["lat"];
  lon = req.query["lon"];
  time = req.query["time"];
  inclTime = req.query["inclTime"];

  if (inclTime == 'Y') {
      params = lat + "," + lon + "," + time;
  } else {
      params = lat + "," + lon;
  }

  url = 'https://api.darksky.net/forecast/1e0eb9c7b5c08912dc3142eb1d210788/' + params;

  console.log(url);
  request.get(url,
      (errorResponse, response, data) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Cache-Control", "no-cache");

          if (errorResponse) {
              res.status(404).send("Error while fetching the result from darksky API.");
              return null;
          }

          data = JSON.parse(data);

          if (!data || !data.hasOwnProperty("currently")) {
              res.status(404).send("Error while fetching the result from darksky API.");
              return null;
          }

          const searchResultModel = {
              timezone: null,
              temperature: null,
              summary: null,
              humidity: null,
              pressure: null,
              windSpeed: null,
              visibility: null,
              cloudCover: null,
              ozone: null,
              icon: null,
              precipIntensity: null,
              precipProbability: null,
              hourly: [],
              daily: [],
          };

          const hourlyResultModel = {
              index: "",
              time: null,
              temperature: null,
              pressure: null,
              humidity: null,
              ozone: null,
              visibility: null,
              windSpeed: null,
          }

          const weeklyResultModel = {
              index: "",
              time: null,
              temperatureLow: null,
              temperatureHigh: null,
          }

          let resultItem = Object.assign({}, searchResultModel);

          if (data.hasOwnProperty("timezone") && data.timezone.length > 0) {
              resultItem.timezone = data.timezone;
          }
          if (data.hasOwnProperty("currently")) {
              const currently = data.currently;
              if (currently.hasOwnProperty("temperature")) {
                  resultItem.temperature = currently.temperature;
              }
              if (currently.hasOwnProperty("summary") && currently.summary.length > 0) {
                  resultItem.summary = currently.summary;
              }
              if (currently.hasOwnProperty("humidity")) {
                  resultItem.humidity = currently.humidity;
              }
              if (currently.hasOwnProperty("pressure")) {
                  resultItem.pressure = currently.pressure;
              }
              if (currently.hasOwnProperty("windSpeed")) {
                  resultItem.windSpeed = currently.windSpeed;
              }
              if (currently.hasOwnProperty("visibility")) {
                  resultItem.visibility = currently.visibility;
              }
              if (currently.hasOwnProperty("cloudCover")) {
                  resultItem.cloudCover = currently.cloudCover;
              }
              if (currently.hasOwnProperty("ozone")) {
                  resultItem.ozone = currently.ozone;
              }
              if (currently.hasOwnProperty("icon") && currently.icon.length > 0) {
                  resultItem.icon = currently.icon;
              }
              if (currently.hasOwnProperty("precipIntensity")) {
                  resultItem.precipIntensity = currently.precipIntensity;
              }
              if (currently.hasOwnProperty("precipProbability")) {
                  resultItem.precipProbability = currently.precipProbability;
              }
          }


          if (data.hasOwnProperty("hourly") && data.hourly.hasOwnProperty("data")) {
              const hourly = data.hourly.data;
              for (let i = 0; i < hourly.length; i++) {
                  let hourlyData = hourly[i];
                  let hourlyItem = Object.assign({}, hourlyResultModel);
                  hourlyItem.index = i + 1 + "";
                  hourlyItem.time = hourlyData.time;
                  hourlyItem.temperature = hourlyData.temperature;
                  hourlyItem.pressure = hourlyData.pressure;
                  hourlyItem.humidity = hourlyData.humidity;
                  hourlyItem.ozone = hourlyData.ozone;
                  hourlyItem.visibility = hourlyData.visibility;
                  hourlyItem.windSpeed = hourlyData.windSpeed;
                  resultItem.hourly.push(hourlyItem);
              }
          }

          if (data.hasOwnProperty("daily") && data.daily.hasOwnProperty("data")) {
              const daily = data.daily.data;
              for (let i = 0; i < daily.length; i++) {
                  let dailyData = daily[i];
                  let dailyItem = Object.assign({}, weeklyResultModel);
                  dailyItem.index = i + 1 + "";
                  dailyItem.time = dailyData.time;
                  dailyItem.temperatureLow = dailyData.temperatureLow;
                  dailyItem.temperatureHigh = dailyData.temperatureHigh;
                  resultItem.daily.push(dailyItem);
              }
          }
          console.log(JSON.stringify(resultItem));
          res.send(JSON.stringify(resultItem));
      });
});

app.get('/getweatherforecast', async(req, res) => {
    lat = req.query["lat"];
    lon = req.query["lon"];
    time = req.query["time"];

    url = 'https://api.darksky.net/forecast/1e0eb9c7b5c08912dc3142eb1d210788/';
    const urls = [
        url + lat + "," + lon + "," + time,
        url + lat + "," + lon
    ];
    try {
        resultData = await getParallel(urls);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "no-cache");

        data = resultData[0];
        data1 = resultData[1];

        if (!data || !data.hasOwnProperty("currently")) {
            res.status(404).send("Error while fetching the result from darksky API.");
            return null;
        }

        const searchResultModel = {
            timezone: null,
            temperature: null,
            summary: null,
            humidity: null,
            pressure: null,
            windSpeed: null,
            visibility: null,
            cloudCover: null,
            ozone: null,
            icon: null,
            precipIntensity: null,
            precipProbability: null,
            hourly: [],
            daily: [],
        };

        const hourlyResultModel = {
            index: "",
            time: null,
            temperature: null,
            pressure: null,
            humidity: null,
            ozone: null,
            visibility: null,
            windSpeed: null,
        }

        const weeklyResultModel = {
            index: "",
            time: null,
            temperatureLow: null,
            temperatureHigh: null,
        }

        let resultItem = Object.assign({}, searchResultModel);

        if (data.hasOwnProperty("timezone") && data.timezone.length > 0) {
            resultItem.timezone = data.timezone;
        }
        if (data.hasOwnProperty("currently")) {
            const currently = data.currently;
            if (currently.hasOwnProperty("temperature")) {
                resultItem.temperature = currently.temperature;
            }
            if (currently.hasOwnProperty("summary") && currently.summary.length > 0) {
                resultItem.summary = currently.summary;
            }
            if (currently.hasOwnProperty("humidity")) {
                resultItem.humidity = currently.humidity;
            }
            if (currently.hasOwnProperty("pressure")) {
                resultItem.pressure = currently.pressure;
            }
            if (currently.hasOwnProperty("windSpeed")) {
                resultItem.windSpeed = currently.windSpeed;
            }
            if (currently.hasOwnProperty("visibility")) {
                resultItem.visibility = currently.visibility;
            }
            if (currently.hasOwnProperty("cloudCover")) {
                resultItem.cloudCover = currently.cloudCover;
            }
            if (currently.hasOwnProperty("ozone")) {
                resultItem.ozone = currently.ozone;
            }
            if (currently.hasOwnProperty("icon") && currently.icon.length > 0) {
                resultItem.icon = currently.icon;
            }
            if (currently.hasOwnProperty("precipIntensity")) {
                resultItem.precipIntensity = currently.precipIntensity;
            }
            if (currently.hasOwnProperty("precipProbability")) {
                resultItem.precipProbability = currently.precipProbability;
            }
        }


        if (data.hasOwnProperty("hourly") && data.hourly.hasOwnProperty("data")) {
            const hourly = data.hourly.data;
            for (let i = 0; i < hourly.length; i++) {
                let hourlyData = hourly[i];
                let hourlyItem = Object.assign({}, hourlyResultModel);
                hourlyItem.index = i + 1 + "";
                hourlyItem.time = hourlyData.time;
                hourlyItem.temperature = hourlyData.temperature;
                hourlyItem.pressure = hourlyData.pressure;
                hourlyItem.humidity = hourlyData.humidity;
                hourlyItem.ozone = hourlyData.ozone;
                hourlyItem.visibility = hourlyData.visibility;
                hourlyItem.windSpeed = hourlyData.windSpeed;
                resultItem.hourly.push(hourlyItem);
            }
        }

        if (data1.hasOwnProperty("daily") && data1.daily.hasOwnProperty("data")) {
            const daily = data1.daily.data;
            for (let i = 0; i < daily.length; i++) {
                let dailyData = daily[i];
                let dailyItem = Object.assign({}, weeklyResultModel);
                dailyItem.index = i + 1 + "";
                dailyItem.time = dailyData.time;
                dailyItem.temperatureLow = dailyData.temperatureLow;
                dailyItem.temperatureHigh = dailyData.temperatureHigh;
                resultItem.daily.push(dailyItem);
            }
        }
        console.log(JSON.stringify(resultItem));
        res.send(JSON.stringify(resultItem));

    } catch (err) {
        res.status(404).send("Error while fetching data from darksky api.");
        return null;
    }
});

var requestAsync = function(url) {
    return new Promise((resolve, reject) => {
        var req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(JSON.parse(body));
        });
    });
};

var getParallel = async function(urls) {
    //transform requests into Promises, await all
    try {
        var data = await Promise.all(urls.map(requestAsync));
        return data;
    } catch (err) {
        throw new Error('Couldnt get data from the darksky api');
    }
}

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});