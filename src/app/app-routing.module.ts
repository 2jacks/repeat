import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    // component: HomeRouteComponent,
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./modules/statistics/statistics.module').then(
        (m) => m.StatisticsModule
      ),
  },
  {
    path: 'workout',
    children: [
      {
        path: 'exercises',
        loadChildren: () =>
          import('./modules/exercises/exercises.module').then(
            (m) => m.ExercisesModule
          ),
      },
      {
        path: 'muscle_groups',
        loadChildren: () =>
          import('./modules/muscle-groups/muscle-groups.module').then(
            (m) => m.MuscleGroupsModule
          ),
      },
      {
        path: 'training',
        loadChildren: () =>
          import('./modules/training/training.module').then(
            (m) => m.TrainingModule
          ),
      },
      {
        path: 'training-program',
        loadChildren: () =>
          import('./modules/training-program/training-program.module').then(
            (m) => m.TrainingProgramModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
