import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainPageComponent } from './modules/main/components/main-page/main.page.component';
import { MuscleGroupsPageComponent } from './modules/muscle-groups/components/muscle-groups-page/muscle-groups.page.component';
import { AppSettingsPageComponent } from './modules/app-settings/components/app-settings-page/app-settings.page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full',
  },
  {
    path: 'main',

    loadChildren: () =>
      import('./modules/main/main.module').then((m) => m.MainModule),
  },
  {
    path: 'muscle_groups',

    loadChildren: () =>
      import('./modules/muscle-groups/muscle-groups.module').then(
        (m) => m.MuscleGroupsModule
      ),
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
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
