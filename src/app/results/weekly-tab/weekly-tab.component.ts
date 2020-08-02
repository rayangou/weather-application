import { Component, OnInit, Input, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { WeatherItem } from '../results.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WeatherService } from 'src/app/weather.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as CanvasJS from './../../../assets/canvasjs.min';

@Component({
  selector: 'app-weekly-tab',
  templateUrl: './weekly-tab.component.html',
  styleUrls: ['./weekly-tab.component.css'],
  providers: [DatePipe]
})
export class WeeklyTabComponent implements OnInit, AfterViewInit {
  @ViewChild('template', { static: false })
  private template: TemplateRef<any>;

  @Input() weatherData: WeatherItem;
  @Input() darkSkyParams: any;

  constructor(private datePipe: DatePipe,
    private weatherService: WeatherService,
    private modalService: BsModalService,
    private decimalPipe: DecimalPipe) { }

  modalRef: BsModalRef;

  public forecastResult: any = [];
  public weatherItem: WeatherItem;
  public selectedDate: string;
  public selectedIcon: string;
  public temperature: string;
  public minTemp = 0;
  public maxTemp = 0;
  public modalDisplayed = false;

  public iconMap = new Map([
    ['clear-day', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png'],
    ['clear-night', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png'],
    ['rain', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png'],
    ['snow', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png'],
    ['sleet', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png'],
    ['wind', 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png'],
    ['fog', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png'],
    ['cloudy', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png'],
    ['partly-cloudy-day', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png'],
    ['partly-cloudy-night', 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png']
  ]);

  temperatureArr: any[] = [];
  daysArr: any[] = [];

  ngAfterViewInit() {
    this.loadChart();
  }
  ngOnInit() {

    this.minTemp = 0;
    this.maxTemp = 0;

    let count = 0;
    let xvalue = 10;

    for (let d in this.weatherData.weeklyData) {
      var date = new Date(parseInt(this.weatherData.weeklyData[d].time) * 1000);
      var medium = this.datePipe.transform(date, "d/M/yyyy");
      console.log(medium);

      this.daysArr.push(medium);

      let tArr: any[] = [];
      tArr.push(parseInt(this.weatherData.weeklyData[d].temperatureLow));
      tArr.push(parseInt(this.weatherData.weeklyData[d].temperatureHigh));

      if (count == 0) {
        this.minTemp = parseInt(this.weatherData.weeklyData[d].temperatureLow);
        this.maxTemp = parseInt(this.weatherData.weeklyData[d].temperatureHigh);
      } else {
        let temp = parseInt(this.weatherData.weeklyData[d].temperatureLow);
        let mtemp = parseInt(this.weatherData.weeklyData[d].temperatureHigh);

        if (temp < this.minTemp) {
          this.minTemp = temp;
        }
        if (mtemp > this.maxTemp) {
          this.maxTemp = mtemp;
        }

      }
      count++;
      this.temperatureArr.push({ x: xvalue, y: tArr, label: medium, color: "#86C7F3" });

      xvalue += 10;
    }

    this.minTemp = this.minTemp - (this.minTemp % 10) - 10;
    this.maxTemp = this.maxTemp + (10 - (this.maxTemp % 10)) + 10;
    //this.loadChart();
  }

  public loadChart() {
    let chart = new CanvasJS.Chart("chartContainer", {
      template: this,
      weatherData: this.weatherData,
      animationEnabled: true,
      exportEnabled: false,
      colorSet: ["#86C7F3"],
      dataPointWidth: 20,
      title: {
        text: "Weekly Weather"
      },
      axisX: {
        title: "Days",
        gridThickness: 0
      },
      axisY: {
        includeZero: false,
        title: "Temperature in Fahrenheit",
        interval: 10,
        gridThickness: 0,
        minimum: this.minTemp,
        maximum: this.maxTemp
      },
      legend: {
        horizontalAlign: "center",
        verticalAlign: "top",
        color: "#86C7F3"
      },
      data: [{
        type: "rangeBar",
        showInLegend: true,
        legendMarkerColor: "#86C7F3",
        indexLabel: "{y[#index]}",
        legendText: "Day wise temperature range",
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        click: this.chartClicked,
        dataPoints:
          this.temperatureArr

      }]
    });

    chart.render();
  }

  public chartClicked(e): void {
    let index = e.dataPointIndex;
    let tmpTime = e.chart.options.template.weatherData.weeklyData[index].time;
    e.chart.options.template.weatherItem = new WeatherItem();

    e.chart.options.template.weatherService.getweatherforecastwithtime(e.chart.options.template.darkSkyParams.latitude, e.chart.options.template.darkSkyParams.longitude, tmpTime, 'Y').subscribe(data => {
      e.chart.options.template.forecastResult = data;
      let i = 0;
      if (data) {
        if (data.timezone != undefined && data.timezone != null) {
          e.chart.options.template.weatherItem.timezone = data.timezone;
        } else {
          e.chart.options.template.weatherItem.timezone = 'N/A';
        }

        if (data.temperature != undefined && data.temperature != null) {
          e.chart.options.template.weatherItem.temperature = data.temperature;
        } else {
          e.chart.options.template.weatherItem.temperature = 0;
        }

        if (data.summary != undefined && data.summary != null) {
          e.chart.options.template.weatherItem.summary = data.summary;
        } else {
          e.chart.options.template.weatherItem.summary = 'N/A';
        }

        if (data.humidity != undefined && data.humidity != null) {
          e.chart.options.template.weatherItem.humidity = e.chart.options.template.decimalPipe.transform(parseFloat(data.humidity) * 100, '1.0-2');
        } else {
          e.chart.options.template.weatherItem.humidity = 'N/A';
        }

        if (data.pressure != undefined && data.pressure != null) {
          e.chart.options.template.weatherItem.pressure = data.pressure;
        } else {
          e.chart.options.template.weatherItem.pressure = 'N/A';
        }

        if (data.windSpeed != undefined && data.windSpeed != null) {
          e.chart.options.template.weatherItem.windSpeed = e.chart.options.template.decimalPipe.transform(parseFloat(data.windSpeed), '1.0-2');
        } else {
          e.chart.options.template.weatherItem.windSpeed = 'N/A';
        }

        if (data.visibility != undefined && data.visibility != null) {
          e.chart.options.template.weatherItem.visibility = data.visibility;
        } else {
          e.chart.options.template.weatherItem.visibility = 'N/A';
        }

        if (data.cloudCover != undefined && data.cloudCover != null) {
          e.chart.options.template.weatherItem.cloudCover = data.cloudCover;
        } else {
          e.chart.options.template.weatherItem.cloudCover = 'N/A';
        }

        if (data.ozone != undefined && data.ozone != null) {
          e.chart.options.template.weatherItem.ozone = data.ozone;
        } else {
          e.chart.options.template.weatherItem.ozone = 'N/A';
        }

        if (data.icon != undefined && data.icon != null) {
          e.chart.options.template.weatherItem.icon = data.icon;
        }

        if (data.precipIntensity != undefined && data.precipIntensity != null) {
          e.chart.options.template.weatherItem.precipIntensity = e.chart.options.template.decimalPipe.transform(parseFloat(data.precipIntensity), '1.0-2');
        } else {
          e.chart.options.template.weatherItem.precipIntensity = 'N/A';
        }
        if (data.precipProbability != undefined && data.precipProbability != null) {
          e.chart.options.template.weatherItem.precipProbability = e.chart.options.template.decimalPipe.transform(parseFloat(data.precipProbability) * 100, '1.0-2');
        } else {
          e.chart.options.template.weatherItem.precipProbability = 'N/A';
        }

        if (data.hourly) {
          e.chart.options.template.weatherItem.hourlyData = data.hourly;
        }

        if (data.daily) {
          e.chart.options.template.weatherItem.weeklyData = data.daily;
        }
      }

      var date = new Date(parseInt(tmpTime) * 1000);
      e.chart.options.template.selectedDate = e.chart.options.template.datePipe.transform(date, "d/M/yyyy");
      e.chart.options.template.selectedIcon = e.chart.options.template.iconMap.get(e.chart.options.template.weatherItem.icon);
      e.chart.options.template.temperature = e.chart.options.template.decimalPipe.transform(e.chart.options.template.weatherItem.temperature, '1.0-0');
      if (e.chart.options.template.modalDisplayed == false) {
        e.chart.options.template.modalDisplayed = true;
        e.chart.options.template.modalRef = e.chart.options.template.modalService.show(e.chart.options.template.template);
      }
    });
  }
}
