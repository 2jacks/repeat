import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesRouteComponent } from './components/_exercises-route/exercises-route.component';
import { NewExerciseComponent } from './components/new-exercise/new-exercise.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesRouteComponent,
  },
  {
    path: 'new',
    component: NewExerciseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesRoutingModule {}
