import { Component, OnInit } from '@angular/core';
import { WeatherItem } from '../results/results.component';
import { FavouritesService } from '../favourites.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

  public favouriteItems: WeatherItem[];
  public selectedItem: WeatherItem;

  constructor(private service: FavouritesService,private router: Router) { }

  ngOnInit() {
    this.favouriteItems = this.service.getAllFavourites();
  }

  removeFromFavourites(id: string) {
    this.service.removeFromFavourites(id);
    this.favouriteItems = [];
    this.favouriteItems = this.service.getAllFavourites();
  }

  getFavDetails(id: string) {
    this.selectedItem = this.service.getFavourite(id);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        params: JSON.stringify(this.selectedItem.darkskyparams)
      }
    };
    this.router.navigate(['/getweatherdetails'], navigationExtras);
  }
}
