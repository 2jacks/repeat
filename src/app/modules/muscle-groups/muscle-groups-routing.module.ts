import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuscleGroupsRouteComponent } from './components/_muscle-groups-route/muscle-groups-route.component';

const routes: Routes = [
  { path: '', component: MuscleGroupsRouteComponent }, // Маршрут по умолчанию для HomeModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Используем forChild
  exports: [RouterModule],
})
export class MuscleGroupsRoutingModule {}
