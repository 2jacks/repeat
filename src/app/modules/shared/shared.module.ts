import { NgModule } from '@angular/core';
import { Environment, CEnvironment } from 'src/app/environment';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  declarations: [],
  exports: [CommonModule, IonicModule, ReactiveFormsModule],
  providers: [
    {
      provide: Environment,
      useValue: CEnvironment,
    },
  ],
})
export class SharedModule {}
