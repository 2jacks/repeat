import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeRouteComponent } from './components/_home-route/home-route.component';
import { TrainingRouteComponent } from './components/_training-route/training-route.component';
import { FoodRouteComponent } from './components/_food-route/food-route.component';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [
    HomeRouteComponent,
    TrainingRouteComponent,
    FoodRouteComponent,
  ],
  exports: [HomeRouteComponent, TrainingRouteComponent, FoodRouteComponent],
  providers: [],
})
export class HomeModule {}
