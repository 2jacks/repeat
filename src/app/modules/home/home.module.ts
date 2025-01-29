import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeRouteComponent } from './components/_home-route/home-route.component';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [HomeRouteComponent],
  exports: [HomeRouteComponent],
  providers: [],
})
export class HomeModule {}
