import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRouteComponent } from './components/_home-route/home-route.component';

const routes: Routes = [
  { path: '', component: HomeRouteComponent }, // Маршрут по умолчанию для HomeModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Используем forChild
  exports: [RouterModule],
})
export class HomeRoutingModule {}
