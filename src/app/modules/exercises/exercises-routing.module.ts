import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesRouteComponent } from './components/_exercises-route/exercises-route.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesRouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesRoutingModule {}
