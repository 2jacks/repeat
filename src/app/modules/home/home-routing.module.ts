import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRouteComponent } from './components/_home-route/home-route.component';
import { TrainingRouteComponent } from './components/_training-route/training-route.component';
import { FoodRouteComponent } from './components/_food-route/food-route.component';

const routes: Routes = [
  {
    path: '',
    component: HomeRouteComponent,
    children: [
      { path: 'training', component: TrainingRouteComponent },
      { path: 'food', component: FoodRouteComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Используем forChild
  exports: [RouterModule],
})
export class HomeRoutingModule {}
