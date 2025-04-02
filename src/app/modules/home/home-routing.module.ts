import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRouteComponent } from './components/_home-route/home-route.component';
import { TrainingRouteComponent } from './components/_training-route/training-route.component';
import { FoodRouteComponent } from './components/_food-route/food-route.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeRouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule], // Используем forChild
  exports: [RouterModule],
})
export class HomeRoutingModule {}
