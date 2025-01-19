import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules/home/components/home-page/home.page.component';
import { MuscleGroupsPageComponent } from './modules/muscle-groups/components/muscle-groups-page/muscle-groups.page.component';
import { AppSettingsPageComponent } from './modules/app-settings/components/app-settings-page/app-settings.page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
    // loadChildren: () =>
    //   import('./modules/home/home.module').then((m) => m.MainModule),
  },
  {
    path: 'muscle_groups',
    component: MuscleGroupsPageComponent,
    // loadChildren: () =>
    //   import('./modules/muscle-groups/muscle-groups.module').then(
    //     (m) => m.MuscleGroupsModule
    //   ),
  },
  {
    path: 'app_settings',
    component: AppSettingsPageComponent,
    // loadChildren: () =>
    //   import('./modules/app-settings/app-settings.module').then(
    //     (m) => m.AppSettingsModule
    //   ),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
