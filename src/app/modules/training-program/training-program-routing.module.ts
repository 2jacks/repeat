import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingProgramRouteComponent } from './components/_training-program-route/training-program-route.component';
import { CreateEditTrainingProgramFormComponent } from './components/create-edit-training-program-form/create-edit-training-program-form.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingProgramRouteComponent,
  },
  {
    path: ':id/edit',
    component: CreateEditTrainingProgramFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingProgramRoutingModule {}
