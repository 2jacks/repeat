import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MuscleGroupsRoutingModule } from './muscle-groups-routing.module';

import { MuscleGroupsPageComponent } from './components/muscle-groups-page/muscle-groups.page.component';
import { MuscleGroupsService } from './services/muscle-groups.service';

@NgModule({
  imports: [SharedModule, MuscleGroupsRoutingModule],
  declarations: [MuscleGroupsPageComponent],
  exports: [MuscleGroupsPageComponent],
  providers: [MuscleGroupsService],
})
export class MuscleGroupsModule {}
