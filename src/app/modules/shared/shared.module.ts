import { NgModule } from '@angular/core';
import { Environment, CEnvironment } from 'src/app/environment';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CI18N, I18N } from './constants/i18n';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  declarations: [],
  exports: [CommonModule, IonicModule, ReactiveFormsModule],
  providers: [
    {
      provide: Environment,
      useValue: CEnvironment,
    },
    {
      provide: I18N,
      useValue: CI18N,
    },
  ],
})
export class SharedModule {}
