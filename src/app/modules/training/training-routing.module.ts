import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrainingSectionRouteComponent } from './components/_training-section-route/training-section-route.component';
import { EditTrainingRouteComponent } from './components/_edit-training-route/edit-training-route.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingSectionRouteComponent,
  },
  {
    path: ':id/edit',
    component: EditTrainingRouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
