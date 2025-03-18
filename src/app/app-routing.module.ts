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
    ],
  },

  {
    path: 'app_settings',
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
