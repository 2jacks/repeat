import { NgModule } from '@angular/core';
import { MuscleGroupsPageComponent } from './components/muscle-groups-page/muscle-groups.page.component';
import { MuscleGroupsService } from './services/muscle-groups.service';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './muscle-groups.routes';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), IonicModule],
  declarations: [MuscleGroupsPageComponent],
  exports: [MuscleGroupsPageComponent],
  providers: [MuscleGroupsService],
  bootstrap: [MuscleGroupsPageComponent],
})
export class MuscleGroupsModule {}
