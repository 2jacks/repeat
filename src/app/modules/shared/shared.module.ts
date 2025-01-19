import { NgModule } from '@angular/core';
import { Environment, CEnvironment } from 'src/app/environment';

import { CommonModule } from '@angular/common';
import { DatabaseService } from './services/database.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [
    DatabaseService,
    {
      provide: Environment,
      useValue: CEnvironment,
    },
  ],
})
export class SharedModule {}
