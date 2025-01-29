import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AppSettingsRoutingModule } from './app-settings-routing.module';

import { AppSettingsService } from './services/app-settings.service';
import { AppSettingsRouteComponent } from './components/_app-settings-route/app-settings-route.component';

@NgModule({
  imports: [SharedModule, AppSettingsRoutingModule],
  declarations: [AppSettingsRouteComponent],
  exports: [AppSettingsRouteComponent],
  providers: [AppSettingsService],
})
export class AppSettingsModule {}
