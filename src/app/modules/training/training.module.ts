import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingRegistryService } from './services/training-registry.service';
import { TrainingSectionRouteComponent } from './components/_training-section-route/training-section-route.component';

import { TrainingListComponent } from './components/training-list/training-list.component';
import { SharedModule } from '../shared/shared.module';
import { EditTrainingComponent } from './components/edit-training/edit-training.component';
import { CreateTrainingFormComponent } from './components/create-training-form/create-training-form.component';
import { ExercisesModule } from '../exercises/exercises.module';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { EditTrainingRouteComponent } from './components/_edit-training-route/edit-training-route.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TrainingSectionRouteComponent,
    TrainingListComponent,
    EditTrainingComponent,
    CreateTrainingFormComponent,
    TrainingFormComponent,
    EditTrainingRouteComponent,
  ],
  imports: [
    TrainingRoutingModule,

    CommonModule,
    FormsModule,
    IonicModule,

    SharedModule,

    ExercisesModule,
  ],
  providers: [TrainingRegistryService],
})
export class TrainingModule {}
