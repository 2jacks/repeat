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
    path: 'workout',
    // redirectTo: 'workout/exercises',
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
        // component: MuscleGroupsRouteComponent,
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
    ],
  },
  // {
  //   path: 'exercises',
  //   // component: ExercisesRouteComponent,
  //   loadChildren: () =>
  //     import('./modules/exercises/exercises.module').then(
  //       (m) => m.ExercisesModule
  //     ),
  // },

  {
    path: 'app_settings',
    // component: AppSettingsRouteComponent,
    loadChildren: () =>
      import('./modules/app-settings/app-settings.module').then(
        (m) => m.AppSettingsModule
      ),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
