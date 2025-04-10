import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsRouteComponent } from './components/_statistics-route/statistics-route.component';
import { TrainingModule } from '../training/training.module';

@NgModule({
  declarations: [StatisticsRouteComponent],
  imports: [CommonModule, StatisticsRoutingModule, TrainingModule],
})
export class StatisticsModule {}
