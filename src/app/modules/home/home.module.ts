import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomePageComponent } from './components/home-page/home.page.component';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [HomePageComponent],
  exports: [HomePageComponent],
  providers: [],
})
export class MainModule {}
