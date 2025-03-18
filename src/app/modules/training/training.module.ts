import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainingRoutingModule } from './components/_training-route/training-routing.module';
import { TrainingRegistryService } from './services/training-registry.service';
import { TrainingRouteComponent } from './components/_training-route/training-route.component';

@NgModule({
  declarations: [TrainingRouteComponent],
  imports: [CommonModule, FormsModule, IonicModule, TrainingRoutingModule],
  providers: [TrainingRegistryService],
})
export class TrainingModule {}
