import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingRegistryService } from './services/training-registry.service';
import { TrainingSectionRouteComponent } from './components/_training-section-route/training-section-route.component';

import { TrainingListComponent } from './components/training-list/training-list.component';
import { SharedModule } from '../shared/shared.module';

import { ExercisesModule } from '../exercises/exercises.module';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { EditTrainingRouteComponent } from './components/_edit-training-route/edit-training-route.component';

import { CompletedTrainingRegistryService } from './services/completed-training-registry.service';

@NgModule({
  declarations: [
    TrainingSectionRouteComponent,
    TrainingListComponent,
    TrainingFormComponent,
    EditTrainingRouteComponent,
  ],
  exports: [TrainingFormComponent],
  imports: [
    TrainingRoutingModule,

    CommonModule,
    FormsModule,
    IonicModule,

    SharedModule,

    ExercisesModule,
  ],
  providers: [TrainingRegistryService, CompletedTrainingRegistryService],
})
export class TrainingModule {}
