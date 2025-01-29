import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSettingsRouteComponent } from './components/_app-settings-route/app-settings-route.component';

const routes: Routes = [
  { path: '', component: AppSettingsRouteComponent }, // Маршрут по умолчанию для HomeModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Используем forChild
  exports: [RouterModule],
})
export class AppSettingsRoutingModule {}
