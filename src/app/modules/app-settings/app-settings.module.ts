import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AppSettingsRoutingModule } from './app-settings-routing.module';

import { AppSettingsService } from './services/app-settings.service';
import { AppSettingsPageComponent } from './components/app-settings-page/app-settings.page.component';

@NgModule({
  imports: [SharedModule, AppSettingsRoutingModule],
  declarations: [AppSettingsPageComponent],
  exports: [AppSettingsPageComponent],
  providers: [AppSettingsService],
})
export class AppSettingsModule {}
