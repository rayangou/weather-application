import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export class WeatherParams {
  street: string;
  city: string;
  state: string[];
  zipCode: string;
}

export class DarkSkyrParams {
  constructor(public latitude: string,
    public longitude: string,
    public city: string,
    public state: string,
    public statevalue: string) {

  }
}

@Component({
  selector: 'app-weather-form',
  templateUrl: './weather-form.component.html',
  styleUrls: ['./weather-form.component.css'],
  providers: [WeatherService]
})
export class WeatherFormComponent implements OnInit {
  weatherForm: FormGroup;

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private weatherService: WeatherService,
    private router: Router) { }

  public cityNames: any[];
  cityctrl: FormControl;
  darkskyParams: DarkSkyrParams;
  public showProgressBar = false;
  statemap = new Map();

  ngOnInit() {
    this.buildForm();
    this.setWeatherFormValidators();
    this.getCityNames();
    this.setstatemap();
    this.http.get<any>('http://localhost:8080').subscribe(data => {
      console.log(data);
    });
  }

  setstatemap() {
    this.statemap.set('AL', 'Alabama');
    this.statemap.set('AK', 'Alaska');
    this.statemap.set('AZ', 'Arizona');
    this.statemap.set('AR', 'Arkansas');
    this.statemap.set('CA', 'California');
    this.statemap.set('CO', 'Colorado');
    this.statemap.set('CT', 'Connecticut');
    this.statemap.set('DE', 'Delaware');
    this.statemap.set('DC', 'District of Columbia');
    this.statemap.set('FL', 'Florida');
    this.statemap.set('GA', 'Georgia');
    this.statemap.set('HI', 'Hawaii');
    this.statemap.set('ID', 'Idaho');
    this.statemap.set('IL', 'Illinois');
    this.statemap.set('IN', 'Indiana');
    this.statemap.set('IA', 'Iowa');
    this.statemap.set('KS', 'Kansas');
    this.statemap.set('KY', 'Kentucky');
    this.statemap.set('LA', 'Louisiana');
    this.statemap.set('ME', 'Maine');
    this.statemap.set('MD', 'Maryland');
    this.statemap.set('MA', 'Massachusetts');
    this.statemap.set('MI', 'Michigan');
    this.statemap.set('MN', 'Minnesota');
    this.statemap.set('MS', 'Mississippi');
    this.statemap.set('MO', 'Missouri');
    this.statemap.set('MT', 'Montana');
    this.statemap.set('NE', 'Nebraska');
    this.statemap.set('NV', 'Nevada');
    this.statemap.set('NH', 'New Hampshire');
    this.statemap.set('NJ', 'New Jersey');
    this.statemap.set('NM', 'New Mexico');
    this.statemap.set('NY', 'New York');
    this.statemap.set('NC', 'North Carolina');
    this.statemap.set('ND', 'North Dakota');
    this.statemap.set('OH', 'Ohio');
    this.statemap.set('OK', 'Oklahoma');
    this.statemap.set('OR', 'Oregon');
    this.statemap.set('PA', 'Pennsylvania');
    this.statemap.set('RI', 'Rhode Island');
    this.statemap.set('SC', 'South Carolina');
    this.statemap.set('SD', 'South Dakota');
    this.statemap.set('TN', 'Tennessee');
    this.statemap.set('TX', 'Texas');
    this.statemap.set('UT', 'Utah');
    this.statemap.set('VT', 'Vermont');
    this.statemap.set('VA', 'Virginia');
    this.statemap.set('WA', 'Washington');
    this.statemap.set('WV', 'West Virginia');
    this.statemap.set('WI', 'Wisconsin');
    this.statemap.set('WY', 'Wyoming');
  }

  buildForm() {
    this.weatherForm = this.formBuilder.group({
      street: [null, [Validators.required, this.noWhitespace]],
      city: [null, [Validators.required, this.noWhitespace]],
      stateselect: ["", [Validators.required]],
      location: [null],
    });
  }

  setWeatherFormValidators() {
    const streetControl = this.weatherForm.get('street');
    const cityControl = this.weatherForm.get('city');
    const stateControl = this.weatherForm.get('stateselect');

    this.weatherForm.get('location').valueChanges
      .subscribe(locationValue => {

        if (locationValue) {
          streetControl.setValidators(null);
          cityControl.setValidators(null);
          stateControl.setValidators(null);

          //streetControl.setValue(null);
          //cityControl.setValue(null);
          //stateControl.setValue("");

          streetControl.disable();
          cityControl.disable();
          stateControl.disable();
        } else {
          streetControl.enable();
          cityControl.enable();
          stateControl.enable();

          //streetControl.setValue(null);
          //cityControl.setValue(null);
          //stateControl.setValue("");

          streetControl.setValidators([Validators.required, this.noWhitespace]);
          cityControl.setValidators([Validators.required, this.noWhitespace]);
          stateControl.setValidators([Validators.required]);
        }

        streetControl.updateValueAndValidity();
        cityControl.updateValueAndValidity();
        stateControl.updateValueAndValidity();
      });
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  getCityNames() {
    this.weatherForm.get('city').valueChanges.pipe().subscribe(data => {
      this.weatherService.getCityNames(data).subscribe(response => {
        this.cityNames = response;
      });
    }, error => {
      this.cityNames = [];
    });
  }

  onSubmit() {
    const weatherFormValue = this.weatherForm.value;
    if (weatherFormValue.location) {
      this.weatherService.getLatLon().subscribe(response => {
        this.showProgressBar = true;
        this.darkskyParams = response;
        this.darkskyParams.city = this.darkskyParams.city;
        this.darkskyParams.state = this.darkskyParams.state;
        this.darkskyParams.statevalue = this.statemap.get(this.darkskyParams.state);
        console.log('darkskyParams: ' + this.darkskyParams.latitude + ':' + this.darkskyParams.longitude);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            params: JSON.stringify(this.darkskyParams)
          }
        };

        document.getElementById('results').className = 'nav-link active';
        document.getElementById('favourites').className = 'nav-link';
        document.getElementById('results').style.backgroundColor = '#5A88A4';
        document.getElementById('favourites').style.backgroundColor = 'white';
        document.getElementById('results').style.color = 'white';
        document.getElementById('favourites').style.color = 'black';
        this.showProgressBar = false;
        this.router.navigate(['/getweatherdetails'], navigationExtras);
      });
    } else {
      if (weatherFormValue.street !== '' && weatherFormValue.city !== '' && weatherFormValue.stateselect !== '') {
        this.showProgressBar = true;
        this.weatherService.getGeoCode(weatherFormValue.street, weatherFormValue.city, weatherFormValue.stateselect).subscribe(response => {
          this.darkskyParams = response;
          this.darkskyParams.city = this.weatherForm.get('city').value;
          this.darkskyParams.state = this.weatherForm.get('stateselect').value;
          this.darkskyParams.statevalue = this.statemap.get(this.darkskyParams.statevalue);
          console.log('darkskyParams: ' + this.darkskyParams.latitude + ':' + this.darkskyParams.longitude);

          let navigationExtras: NavigationExtras = {
            queryParams: {
              params: JSON.stringify(this.darkskyParams)
            }
          };

          document.getElementById('results').className = 'nav-link active';
          document.getElementById('favourites').className = 'nav-link';
          document.getElementById('results').style.backgroundColor = '#5A88A4';
          document.getElementById('favourites').style.backgroundColor = 'white';
          document.getElementById('results').style.color = 'white';
          document.getElementById('favourites').style.color = 'black';
          this.showProgressBar = false;
          this.router.navigate(['/getweatherdetails'], navigationExtras);
        }, error => {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              params: undefined
            }
          };
          this.showProgressBar = false;
          this.router.navigate(['/getweatherdetails'], navigationExtras);
        });
      }
    }
  }

  clear() {
    this.weatherForm.get('street').clearValidators();
    this.weatherForm.get('city').clearValidators();
    this.weatherForm.get('stateselect').clearValidators();

    document.getElementById('results').className = 'nav-link active';
    document.getElementById('favourites').className = 'nav-link';
    document.getElementById('results').style.backgroundColor = '#5A88A4';
    document.getElementById('favourites').style.backgroundColor = 'white';
    document.getElementById('results').style.color = 'white';
    document.getElementById('favourites').style.color = 'black';

    this.router.navigateByUrl('/');
  }

  switchToFavourites() {
    document.getElementById('favourites').className = 'nav-link active';
    document.getElementById('results').className = 'nav-link';
    document.getElementById('favourites').style.backgroundColor = '#5A88A4';
    document.getElementById('results').style.backgroundColor = 'white';
    document.getElementById('favourites').style.color = 'white';
    document.getElementById('results').style.color = 'black';
  }

  switchToResults() {
    document.getElementById('results').className = 'nav-link active';
    document.getElementById('favourites').className = 'nav-link';
    document.getElementById('results').style.backgroundColor = '#5A88A4';
    document.getElementById('favourites').style.backgroundColor = 'white';
    document.getElementById('results').style.color = 'white';
    document.getElementById('favourites').style.color = 'black';

    this.onSubmit();
    this.router.navigateByUrl('/');
  }
}
