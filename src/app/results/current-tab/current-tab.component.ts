import { Component, OnInit, Input } from '@angular/core';
import { WeatherItem } from '../results.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-current-tab',
  templateUrl: './current-tab.component.html',
  styleUrls: ['./current-tab.component.css']
})
export class CurrentTabComponent implements OnInit {
  @Input() weatherData: WeatherItem;
  @Input() darkSkyParams: any;
  
  temperature: string;

  constructor(private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    console.log('this.weatherData.temperature: ' + this.weatherData.temperature);
    this.temperature = this.decimalPipe.transform(this.weatherData.temperature, '1.0-0');
  }
  
}
