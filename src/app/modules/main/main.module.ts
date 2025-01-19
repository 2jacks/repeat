import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './main.routes';
import { IonicModule } from '@ionic/angular';
import { MainPageComponent } from './components/main-page/main.page.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), IonicModule],
  declarations: [MainPageComponent],
  exports: [MainPageComponent],
  providers: [],
})
export class MainModule {}
