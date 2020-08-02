import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class CityName {
  cityName: string;

  constructor(private cname: string) {
    this.cityName = cname;
  }
}

export class Geolocation {
  constructor(private latitude: string, 
    private longitude: string, 
    private city: string, 
    private state: string,
    private statevalue: string) {

  }
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  apiURL = 'https://bubbly-subject-254207.appspot.com';
  ipapiURL = 'https://ipapi.co/json/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    
    return throwError(errorMessage);
  }

  getCityNames(cityName: string): Observable<any[]> {
    return this.http.get<any>(this.apiURL + '/getcities' + '?city=' + cityName)
      .pipe(
        catchError(this.handleError), map(res => {
          let results: CityName[] = [];

          let len = 5;
          let index = 0;
          if (res.predictions) {
            if (res.predictions.length < 5) {
              len = res.predictions.length;
            }

            for (index = 0; index < len; index++) {
              if (res.predictions[index].structured_formatting && res.predictions[index].structured_formatting.main_text) {
                results.push(new CityName(res.predictions[index].structured_formatting.main_text));
              }
            }
          }
          return results;
        }));
  }

  getLatLon(): Observable<any> {
    return this.http.get<any>(this.ipapiURL)
      .pipe(
        catchError(this.handleError), map(res => {
          if (res.latitude && res.longitude && res.city && res.region_code) {
            let geo = new Geolocation(res.latitude, res.longitude,res.city, res.region_code, res.region);
            return geo;
          }
          let geo = new Geolocation('34.0322', '-118.2836', 'Los Angeles', 'California', 'California');
          return geo;
        }));
  }

  getGeoCode(streeName: string, cityName: string, stateName: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/getgeocode' + '?street=' + streeName + '&city=' + cityName + '&state=' + stateName)
      .pipe(
        catchError(this.handleError), map(res => {
          if (res.results && res.results[0].geometry && res.results[0].geometry.location && res.results[0].geometry.location.lat && res.results[0].geometry.location.lng) {
            let geo = new Geolocation(res.results[0].geometry.location.lat, res.results[0].geometry.location.lng, cityName, stateName, stateName);
            return geo;
          } else {
            return throwError('Invalid Address.'); 
          }
        }));
  }

  getWeatherForecast(lat: string, lon: string, timeStr: string, inclTime: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/getweatherforecast' + '?lat=' + lat + '&lon=' + lon + '&time=' + timeStr+ '&inclTime=' + inclTime)
      .pipe(
        catchError(this.handleError), map(res => {
          return res;
        }));
  }

  getweatherforecastwithtime(lat: string, lon: string, timeStr: string, inclTime: string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/getweatherforecastwithtime' + '?lat=' + lat + '&lon=' + lon + '&time=' + timeStr+ '&inclTime=' + inclTime)
      .pipe(
        catchError(this.handleError), map(res => {
          return res;
        }));
  }

  async getStateSeal(state: string): Promise<string> {
    let data = await this.http.get<any>(this.apiURL + '/getstateseal?state=' + state).toPromise();
    if (data && data[0]) {
      console.log('State seal link: ' + data[0]);
      return data[0];
    }
    return '';
  }
}
