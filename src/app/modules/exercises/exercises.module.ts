import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesRegistryService } from './services/exercises-registry.service';
import { IonicModule } from '@ionic/angular';
import { ExercisesRouteComponent } from './components/_exercises-route/exercises-route.component';
import { ExercisesListComponent } from './components/exercises-list/exercises-list.component';

import { SharedModule } from '../shared/shared.module';
import { MuscleGroupsModule } from '../muscle-groups/muscle-groups.module';

import { CreateEditExerciseFormComponent } from './components/create-edit-exercise-form/create-edit-exercise-form.component';
import { CompletedExercisesRegistryService } from './services/completed-exercises-registry.service';
@NgModule({
  declarations: [
    ExercisesRouteComponent,
    ExercisesListComponent,
    CreateEditExerciseFormComponent,
  ],
  exports: [
    ExercisesRouteComponent,
    CreateEditExerciseFormComponent,
    ExercisesListComponent,
  ],
  imports: [
    ExercisesRoutingModule,

    IonicModule,

    SharedModule,
    CommonModule,

    MuscleGroupsModule,
  ],
  providers: [ExercisesRegistryService, CompletedExercisesRegistryService],
})
export class ExercisesModule {}
