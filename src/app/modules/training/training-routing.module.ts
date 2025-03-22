import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingRouteComponent } from './components/_training-route/training-route.component';
import { EditTrainingComponent } from './components/edit-training/edit-training.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingRouteComponent,
  },
  {
    path: ':id/edit',
    component: EditTrainingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
