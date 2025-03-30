import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TrainingProgramRouteComponent } from './components/_training-program-route/training-program-route.component';
import { CreateEditTrainingProgramFormComponent } from './components/create-edit-training-program-form/create-edit-training-program-form.component';
import { TrainingProgramListComponent } from './components/training-program-list/training-program-list.component';
import { TrainingProgramRegistryService } from './services/training-program-registry.service';

import { TrainingProgramRoutingModule } from './training-program-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TrainingModule } from '../training/training.module';

@NgModule({
  declarations: [
    TrainingProgramRouteComponent,
    CreateEditTrainingProgramFormComponent,
    TrainingProgramListComponent,
  ],
  imports: [
    CommonModule,
    TrainingProgramRoutingModule,
    SharedModule,
    TrainingModule,
  ],
  providers: [TrainingProgramRegistryService],
})
export class TrainingProgramModule {}
