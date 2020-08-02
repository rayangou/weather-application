import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResultsComponent } from './results/results.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { WeatherFormComponent } from './weather-form/weather-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule, MatSelectModule, MatIconModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrentTabComponent } from './results/current-tab/current-tab.component';
import { HourlyTabComponent } from './results/hourly-tab/hourly-tab.component';
import { WeeklyTabComponent } from './results/weekly-tab/weekly-tab.component';
import { TitleCasePipe, DecimalPipe } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    FavouritesComponent,
    WeatherFormComponent,
    CurrentTabComponent,
    HourlyTabComponent,
    WeeklyTabComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    ChartsModule,
    LayoutModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [
      TitleCasePipe,
      DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
