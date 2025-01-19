import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSettingsPageComponent } from './components/app-settings-page/app-settings.page.component';

const routes: Routes = [
  { path: '', component: AppSettingsPageComponent }, // Маршрут по умолчанию для HomeModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Используем forChild
  exports: [RouterModule],
})
export class AppSettingsRoutingModule {}
