import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { WeatherItem } from '../results.component';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-hourly-tab',
  templateUrl: './hourly-tab.component.html',
  styleUrls: ['./hourly-tab.component.css']
})
export class HourlyTabComponent implements OnInit, AfterViewInit {
  @Input() weatherData: WeatherItem;
  @Input() darkSkyParams: any;

  temperatureArr: any[] = [];
  pressureArr: any[] = [];
  humidityArr: any[] = [];
  ozoneArr: any[] = [];
  visibilityArr: any[] = [];
  windSpeedArr: any[] = [];

  maxTemp: number = 0;
  maxPressure: number = 0;
  maxOzone: number = 0;
  maxHumidity: number = 0;

  minTemp: number = -999;
  minPressure: number = -999;
  minOzone: number = -999;
  minHumidity: number = -999;
  minVisibility: number = -999;

  constructor() { }
  public barChartPlugins = [{
    /* Adjust axis labelling font size according to chart size */
    beforeDraw: function (c) {
      var chartHeight = c.chart.height;
      var mul = 5;
      if (chartHeight > 500) {
        mul = 3;
      } else if (chartHeight > 300) {
        mul = 4;
      }
      var size = chartHeight * mul / 100;
      c.scales['y-axis-0'].options.ticks.minor.fontSize = size;
    }
  }];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: ''
        },
        ticks: {
          suggestedMax: 0,
          suggestedMin: 0,
          stepSize: 1,
          userCallback: function (label, index, labels) {
            return label;
          }
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: ''
        }
      }],
    },
    plugins: {
      datalabels: {
        display: false,
      }
    },
    legend: {
      onClick: (e) => e.stopPropagation()
    }
  };
  public barChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [], label: 'temperature' }
  ];

  public barChartColors: Color[] = [
    { backgroundColor: '#86C7F3', borderColor: 'rgb(33, 113, 181)' }
  ];

  ngOnInit() {
    //console.log(this.weatherData.hourlyData);
    for (let d = 0; d < 24; d++) {
      // var date = new Date(parseInt(this.weatherData.hourlyData[d].time) * 1000);
      // var medium = this.datePipe.transform(date, "MMM d, y, h:mm:ss a zzzz");
      //console.log(medium);

      if (this.weatherData.hourlyData[d].temperature > this.maxTemp) {
        this.maxTemp = this.weatherData.hourlyData[d].temperature;
      }
      if (this.minTemp == -999)
        this.minTemp = this.weatherData.hourlyData[d].temperature;
      else if (this.weatherData.hourlyData[d].temperature < this.minTemp)
        this.minTemp = this.weatherData.hourlyData[d].temperature;

      this.temperatureArr.push(this.weatherData.hourlyData[d].temperature);

      let pressure = parseFloat(this.weatherData.hourlyData[d].pressure);
      if (pressure > this.maxPressure) {
        this.maxPressure = pressure;
      }
      if (this.minPressure == -999)
        this.minPressure = pressure;
      else if (pressure < this.minPressure)
        this.minPressure = pressure;

      this.pressureArr.push(pressure);

      let humidity = parseFloat(this.weatherData.hourlyData[d].humidity) * 100;
      if (humidity > this.maxHumidity) {
        this.maxHumidity = humidity;
      }

      if (this.minHumidity == -999)
        this.minHumidity = humidity;
      else if (humidity < this.minHumidity)
        this.minHumidity = humidity;

      this.humidityArr.push(humidity);

      let ozone = parseInt(this.weatherData.hourlyData[d].ozone);
      if (ozone > this.maxOzone) {
        this.maxOzone = ozone;
      }
      if (this.minOzone == -999)
        this.minOzone = ozone;
      else if (ozone < this.minOzone)
        this.minOzone = ozone;

      let visibility = parseInt(this.weatherData.hourlyData[d].visibility);
      if (this.minVisibility == -999)
        this.minVisibility = visibility;
      else if (visibility < this.minVisibility)
        this.minVisibility = visibility;

      this.ozoneArr.push(this.weatherData.hourlyData[d].ozone);
      this.visibilityArr.push(this.weatherData.hourlyData[d].visibility);
      this.windSpeedArr.push(this.weatherData.hourlyData[d].windSpeed);
    }

    this.maxTemp = this.maxTemp + 2;
    this.maxPressure = Math.floor(this.maxPressure) + 2;
    this.maxHumidity += 5;
    this.maxOzone = this.maxOzone + (10 - (this.maxOzone % 10));

    this.minTemp = this.minTemp - 2;
    this.minPressure = this.minPressure - 2;
    this.minOzone = this.minOzone - 5;
    this.minHumidity = this.minHumidity - 5;
    this.minVisibility = this.minVisibility > 0 ? this.minVisibility - 1 : 0;
  }

  ngAfterViewInit() {
    this.barChartData = [{ data: this.temperatureArr, label: 'temperature' }];
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Fahrenheit'
          },
          ticks: {
            suggestedMax: this.maxTemp,
            suggestedMin: this.minTemp,
             stepSize: 0,
            userCallback: function (label, index, labels) {
              return label;
            }
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          }
        }],
      },
      plugins: {
        datalabels: {
          display: false,
        }
      },
      legend: {
        onClick: (e) => e.stopPropagation()
      }
    };
  }

  loadTabData(id: any) {
    if (id == "0") {
      this.barChartData = [{ data: this.temperatureArr, label: 'temperature' }];
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Fahrenheit'
            },
            ticks: {
              suggestedMax: this.maxTemp,
              suggestedMin: this.minTemp,
               stepSize: 0,
              userCallback: function (label, index, labels) {
                return label;
              }
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
        },
        plugins: {
          datalabels: {
            display: false,
          }
        },
        legend: {
          onClick: (e) => e.stopPropagation()
        }
      };
    } else if (id == "1") {
      this.barChartData = [{ data: this.pressureArr, label: 'pressure' }];
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Millibars'
            },
            ticks: {
              suggestedMax: this.maxPressure,
              suggestedMin: this.minPressure,
              stepSize: 0,
              userCallback: function (label, index, labels) {
                return label;
              }
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
        },
        plugins: {
          datalabels: {
            display: false,
          }
        },
        legend: {
          onClick: (e) => e.stopPropagation()
        }
      };
    } else if (id == "2") {
      this.barChartData = [{ data: this.humidityArr, label: 'humidity' }];
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '% Humidity'
            },
            ticks: {
              suggestedMax: this.maxHumidity,
              suggestedMin: this.minHumidity,
              stepSize: 0,
              userCallback: function (label, index, labels) {
                return label;
              }
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
        },
        plugins: {
          datalabels: {
            display: false,
          }
        },
        legend: {
          onClick: (e) => e.stopPropagation()
        }
      };
    } else if (id == "3") {
      this.barChartData = [{ data: this.ozoneArr, label: 'ozone' }];
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Dobson Units'
            },
            ticks: {
              suggestedMax: this.maxOzone,
              suggestedMin: this.minOzone,
              stepSize: 0,
              userCallback: function (label, index, labels) {
                return label;
              }
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
        },
        plugins: {
          datalabels: {
            display: false,
          }
        },
        legend: {
          onClick: (e) => e.stopPropagation()
        }
      };
    } else if (id == "4") {
      this.barChartData = [{ data: this.visibilityArr, label: 'visibility' }];
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Miles (Maximum 10)',
            },
            ticks: {
              suggestedMax: 12,
              suggestedMin: this.minVisibility,
              stepSize: 1,
              userCallback: function (label, index, labels) {
                return label;
              }
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
        },
        plugins: {
          datalabels: {
            display: false,
          }
        }, legend: {
          onClick: (e) => e.stopPropagation()
        }
      };
    } else if (id == "5") {
      this.barChartData = [{ data: this.windSpeedArr, label: 'windSpeed' }];
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Miles per Hour'
            },
            ticks: {
              suggestedMax: 9,
              suggestedMin: 1,
              stepSize: 1,
              userCallback: function (label, index, labels) {
                if (Math.floor(label) === label) {
                  return label;
                }
              }
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time difference from current hour'
            }
          }],
        },
        plugins: {
          datalabels: {
            display: false,
          }
        }, legend: {
          onClick: (e) => e.stopPropagation()
        }
      };
    }
  }
}
