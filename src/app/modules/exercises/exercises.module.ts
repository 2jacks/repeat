import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesService } from './services/exercises.service';
import { IonicModule } from '@ionic/angular';
import { ExercisesRouteComponent } from './components/_exercises-route/exercises-route.component';
import { ExercisesListComponent } from './components/exercises-list/exercises-list.component';

import { SharedModule } from '../shared/shared.module';
import { MuscleGroupsModule } from '../muscle-groups/muscle-groups.module';
import { NewExerciseComponent } from './components/new-exercise/new-exercise.component';

@NgModule({
  declarations: [
    ExercisesRouteComponent,
    ExercisesListComponent,
    NewExerciseComponent,
  ],
  exports: [NewExerciseComponent],
  imports: [
    ExercisesRoutingModule,

    IonicModule,

    SharedModule,
    CommonModule,

    MuscleGroupsModule,
  ],
  providers: [ExercisesService],
})
export class ExercisesModule {}
