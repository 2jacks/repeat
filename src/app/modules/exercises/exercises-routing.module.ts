import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesRouteComponent } from './components/_exercises-route/exercises-route.component';
import { CreateEditExerciseFormComponent } from './components/create-edit-exercise-form/create-edit-exercise-form.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesRouteComponent,
  },
  {
    path: ':id/edit',
    component: CreateEditExerciseFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesRoutingModule {}
