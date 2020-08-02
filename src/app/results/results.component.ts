import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouritesService } from '../favourites.service';
import { MatIconRegistry } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { DarkSkyrParams } from '../weather-form/weather-form.component';

export class HourlyData {
  time: string;
  temperature: number;
  pressure: string;
  humidity: string;
  ozone: string;
  visibility: string;
  windSpeed: string;
}

export class WeeklyData {
  time: string;
  temperatureLow: string;
  temperatureHigh: string;

}
export class WeatherItem {
  index: number;
  city: string;
  state: string;
  timezone: string;
  temperature: number;
  summary: string;
  humidity: string;
  pressure: string;
  windSpeed: string;
  visibility: string;
  cloudCover: string;
  ozone: string;
  stateSealLink: string;
  icon: string;
  precipIntensity: string;
  precipProbability: string;
  hourlyData: HourlyData[];
  weeklyData: WeeklyData[];
  darkskyparams: DarkSkyrParams;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  public showProgressBar: boolean;
  public darkSkyParams: any;
  public forecastResult: any = [];
  public noResults = false;
  public weatherItem: WeatherItem;
  public errorMessage = "No Records.";

  public activeId = 'current-tab';

  public tabs = [
    { id: 'current-tab', title: 'Current' },
    { id: 'hourly-tab', title: 'Hourly' },
    { id: 'weekly-tab', title: 'Weekly' }
  ];

  constructor(private weatherService: WeatherService, private favouritesService: FavouritesService,
    private route: ActivatedRoute, private router: Router, public matIconRegistry: MatIconRegistry,
    private titlecasePipe: TitleCasePipe) {
    matIconRegistry.registerFontClassAlias('fa');
  }

  setActive(id: any) {
    this.activeId = id;
  }

  getWeatherForecastAndStateSeal(lat: string, lon: string) {
    this.showProgressBar = true;
    this.weatherItem = new WeatherItem();
    this.weatherItem.city = this.titlecasePipe.transform(this.darkSkyParams.city);
    this.weatherItem.state = this.darkSkyParams.state;
    this.weatherItem.darkskyparams = this.darkSkyParams;

    this.weatherService.getStateSeal(this.weatherItem.darkskyparams.statevalue).then(data => {
      this.weatherItem.stateSealLink = data;
      this.getWeatherForecast(lat, lon, Math.floor((new Date).getTime() / 1000) + '');
    }).catch(e => {
      this.getWeatherForecast(lat, lon, Math.floor((new Date).getTime() / 1000) + '');
    });
  }

  getWeatherForecast(lat: string, lon: string, timeStr: string) {
    this.errorMessage = "No Records.";
    this.weatherService.getweatherforecastwithtime(lat, lon, timeStr, 'N').subscribe(data => {
      this.forecastResult = data;
      let i = 0;
      if (data) {
        if (data.timezone != undefined && data.timezone != null) {
          this.weatherItem.timezone = data.timezone;
        } else {
          this.weatherItem.timezone = 'N/A';
        }

        if (data.temperature != undefined && data.temperature != null) {
          this.weatherItem.temperature = data.temperature;
        } else {
          this.weatherItem.temperature = 0;
        }
        if (data.summary != undefined && data.summary != null) {
          this.weatherItem.summary = data.summary;
        } else {
          this.weatherItem.summary = '';
        }
        if (data.humidity != undefined && data.humidity != null) {
          this.weatherItem.humidity = data.humidity;
        } else {
          this.weatherItem.humidity = '0';
        }
        if (data.pressure != undefined && data.pressure != null) {
          this.weatherItem.pressure = data.pressure;
        } else {
          this.weatherItem.pressure = '0';
        }
        if (data.windSpeed != undefined && data.windSpeed != null) {
          this.weatherItem.windSpeed = data.windSpeed;
        } else {
          this.weatherItem.windSpeed = '0';
        }

        if (data.visibility != undefined && data.visibility != null) {
          this.weatherItem.visibility = data.visibility;
        } else {
          this.weatherItem.visibility = '0';
        }
        if (data.cloudCover != undefined && data.cloudCover != null) {
          this.weatherItem.cloudCover = data.cloudCover;
        } else {
          this.weatherItem.cloudCover = '0';
        }
        if (data.ozone != undefined && data.ozone != null) {
          this.weatherItem.ozone = data.ozone;
        } else {
          this.weatherItem.ozone = '0';
        }

        if (data.hourly != undefined && data.hourly != null) {
          this.weatherItem.hourlyData = data.hourly;
        }

        if (data.daily != undefined && data.daily != null) {
          this.weatherItem.weeklyData = data.daily;
        }
        this.noResults = false;
        this.showProgressBar = false;
      } else {
        this.showProgressBar = false;
        this.noResults = true;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      if (data.params === undefined) {
        this.errorMessage = "Invalid Address."
        this.showProgressBar = false;
        this.noResults = true;
      } else {
        this.darkSkyParams = JSON.parse(data.params);
        this.activeId = 'current-tab';
        this.getWeatherForecastAndStateSeal(this.darkSkyParams.latitude, this.darkSkyParams.longitude);
      }
    });
  }

  tweet() {
    let url = 'https://twitter.com/intent/tweet?text=';
    url += `The current temperature at ${this.weatherItem.city} is ${this.weatherItem.temperature}` + '%C2%B0' + ` F. The weather conditions are ${this.weatherItem.summary}.`;
    url += '&hashtags=CSCI571WeatherSearch';
    var newWin = window.open(url, 'tweet', 'height=600, width=600');
  }

  isFavorited(): boolean {
    return this.favouritesService.isPresent(this.weatherItem.city + ':' + this.weatherItem.state);
  }

  setFavorite() {
    this.favouritesService.addtoFavourites(this.weatherItem);
  }

  removeFavorite() {
    this.favouritesService.removeFromFavourites(this.weatherItem.city + ':' + this.weatherItem.state);
  }
}
