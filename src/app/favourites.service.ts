import { Injectable } from '@angular/core';
import { WeatherItem } from './results/results.component';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private favouritesStorage = window.localStorage;
  private favoutitesMap: Map<string, WeatherItem> = new Map();

  constructor() { }

  addtoFavourites(wloc: WeatherItem) {
    console.log(wloc);
    let wid = wloc.city + ':' + wloc.state;
    if (this.favouritesStorage.getItem(wid) === null) {
      this.favouritesStorage.setItem(wid, JSON.stringify(wloc));
      this.favoutitesMap.set(wid, wloc);
      console.log('Added to local storage');
    }
    console.log(this.favouritesStorage);
  }

  getFavourite(id: string):WeatherItem {
    return JSON.parse(this.favouritesStorage.getItem(id));
  }

  removeFromFavourites(id: string) {
    console.log(id);
    this.favouritesStorage.removeItem(id);
  }

  getAllFavourites() {
    var wishlist: WeatherItem[] = [];
    const keys = Object.keys(this.favouritesStorage);
    let i = keys.length;

    while (i--) {
      console.log(keys[i]);
      wishlist.push(JSON.parse(this.favouritesStorage.getItem(keys[i])));
    }
    console.log(wishlist);
    return wishlist;
  }

  isPresent(id: string) {
    return (this.favouritesStorage.getItem(id) != null);
  }
}
