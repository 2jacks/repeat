import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsRouteComponent } from './components/_statistics-route/statistics-route.component';
import { TrainingModule } from '../training/training.module';
import { SharedModule } from '../shared/shared.module';
import { CompletedTrainingListComponent } from './components/completed-training-list/completed-training-list.component';
import { ExercisesStatisticsComponent } from './components/exercises-statistics/exercises-statistics.component';
import { CommonExerciseStatisticsComponent } from './components/exercises-statistics/common-exercises-statistics/common-exercise-statistics.component';
import { SpecificExerciseStatisticsComponent } from './components/exercises-statistics/specific-exercise-statistics/specific-exercise-statistics.component';
import { StatisticsService } from './services/statistics.service';
import { ExercisesModule } from '../exercises/exercises.module';
import { CurrentModule } from '../current/current.module';
import { ChartService } from './services/chart.service';
@NgModule({
  declarations: [
    StatisticsRouteComponent,
    CompletedTrainingListComponent,
    ExercisesStatisticsComponent,
    CommonExerciseStatisticsComponent,
    SpecificExerciseStatisticsComponent,
  ],
  imports: [
    StatisticsRoutingModule,
    CurrentModule,
    ExercisesModule,
    CommonModule,

    TrainingModule,
    SharedModule,
  ],
  exports: [
    CommonExerciseStatisticsComponent,
    SpecificExerciseStatisticsComponent,
  ],
  providers: [StatisticsService, ChartService],
})
export class StatisticsModule {}
