import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MuscleGroupsRoutingModule } from './muscle-groups-routing.module';

import { MuscleGroupsRouteComponent } from './components/_muscle-groups-route/muscle-groups-route.component';
import { MuscleGroupsService } from './services/muscle-groups.service';
import { MuscleGroupIconComponent } from './components/muscle-group-icon/muscle-group-icon.component';

@NgModule({
  imports: [SharedModule, MuscleGroupsRoutingModule],
  declarations: [MuscleGroupsRouteComponent, MuscleGroupIconComponent],
  exports: [MuscleGroupsRouteComponent, MuscleGroupIconComponent],
  providers: [MuscleGroupsService],
})
export class MuscleGroupsModule {}
