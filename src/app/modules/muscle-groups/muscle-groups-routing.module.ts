import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuscleGroupsPageComponent } from './components/muscle-groups-page/muscle-groups.page.component';

const routes: Routes = [
  { path: '', component: MuscleGroupsPageComponent }, // Маршрут по умолчанию для HomeModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Используем forChild
  exports: [RouterModule],
})
export class MuscleGroupsRoutingModule {}
