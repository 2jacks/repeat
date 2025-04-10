import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsRouteComponent } from './components/_statistics-route/statistics-route.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsRouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
