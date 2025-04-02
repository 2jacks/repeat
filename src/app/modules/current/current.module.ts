import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentRegistryService } from './services/current-registry.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [CurrentRegistryService],
})
export class CurrentModule {}
