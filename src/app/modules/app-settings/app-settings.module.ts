import { NgModule } from '@angular/core';
import { AppSettingsService } from './services/app-settings.service';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './app-settings.routes';
import { IonicModule } from '@ionic/angular';
import { AppSettingsPageComponent } from './components/app-settings-page/app-settings.page.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), IonicModule],
  declarations: [AppSettingsPageComponent],
  exports: [AppSettingsPageComponent],
  providers: [AppSettingsService],
})
export class AppSettingsModule {}
