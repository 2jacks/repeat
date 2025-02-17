import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MuscleGroupsRoutingModule } from './muscle-groups-routing.module';

import { MuscleGroupsRouteComponent } from './components/_muscle-groups-route/muscle-groups-route.component';
import { MuscleGroupsRegistryService } from './services/muscle-groups-registry.service';
import { MuscleGroupIconComponent } from './components/muscle-group-icon/muscle-group-icon.component';

@NgModule({
  imports: [SharedModule, MuscleGroupsRoutingModule],
  declarations: [MuscleGroupsRouteComponent, MuscleGroupIconComponent],
  exports: [MuscleGroupsRouteComponent, MuscleGroupIconComponent],
  providers: [MuscleGroupsRegistryService],
})
export class MuscleGroupsModule {}
