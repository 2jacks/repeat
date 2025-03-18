import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingRouteComponent } from './training-route.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingRouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
