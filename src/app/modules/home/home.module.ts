import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeRouteComponent } from './components/_home-route/home-route.component';
import { TrainingRouteComponent } from './components/_training-route/training-route.component';
import { FoodRouteComponent } from './components/_food-route/food-route.component';
import { CurrentRegistryService } from '../current/services/current-registry.service';
import { CurrentModule } from '../current/current.module';
import { TrainingProgramModule } from '../training-program/training-program.module';
import { TUI_DAY_TYPE_HANDLER } from '@taiga-ui/core';
import { TuiDay } from '@taiga-ui/cdk';

function today(day: TuiDay) {
  const currentDay = TuiDay.currentLocal();
  if (currentDay.daySame(day)) {
    return 'today';
  }

  return day.isWeekend ? 'weekend' : 'weekday';
}

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    CurrentModule,
    TrainingProgramModule,
  ],
  declarations: [
    HomeRouteComponent,
    TrainingRouteComponent,
    FoodRouteComponent,
  ],
  exports: [HomeRouteComponent, TrainingRouteComponent, FoodRouteComponent],
  providers: [
    {
      provide: TUI_DAY_TYPE_HANDLER,
      useValue: today,
    },
  ],
})
export class HomeModule {}
