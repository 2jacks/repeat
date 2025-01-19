import { NgModule } from '@angular/core';
import { Environment, CEnvironment } from 'src/app/environment';

import { CommonModule } from '@angular/common';
import { DatabaseService } from './services/database.service';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [],
  exports: [CommonModule, IonicModule],
  providers: [
    DatabaseService,
    {
      provide: Environment,
      useValue: CEnvironment,
    },
  ],
})
export class SharedModule {}
