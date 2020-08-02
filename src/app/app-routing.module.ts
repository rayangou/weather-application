import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { FavouritesComponent } from './favourites/favourites.component';

const routes: Routes = [{ path: 'getweatherdetails', component: ResultsComponent },
{ path: 'favourites', component: FavouritesComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
