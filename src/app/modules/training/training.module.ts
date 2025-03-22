import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingRegistryService } from './services/training-registry.service';
import { TrainingRouteComponent } from './components/_training-route/training-route.component';

import { TrainingListComponent } from './components/training-list/training-list.component';
import { SharedModule } from '../shared/shared.module';
import { EditTrainingComponent } from './components/edit-training/edit-training.component';
import { CreateTrainingFormComponent } from './components/create-training-form/create-training-form.component';
import { ExercisesModule } from '../exercises/exercises.module';
import { TaigaUiModule } from '../taiga-ui/taiga-ui.module';

@NgModule({
  declarations: [
    TrainingRouteComponent,
    TrainingListComponent,
    EditTrainingComponent,
    CreateTrainingFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingRoutingModule,

    ExercisesModule,
    SharedModule,
  ],
  providers: [TrainingRegistryService],
})
export class TrainingModule {}
