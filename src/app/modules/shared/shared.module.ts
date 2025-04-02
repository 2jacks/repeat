import { NgModule } from '@angular/core';
import { Environment, CEnvironment } from 'src/app/environment';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CI18N, I18N } from './constants/i18n';
import { TaigaUiModule } from '../taiga-ui/taiga-ui.module';
import { RuDatePipe } from './utils/ru-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TaigaUiModule,
    FormsModule,
  ],
  declarations: [RuDatePipe],
  exports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TaigaUiModule,
    FormsModule,
    RuDatePipe,
  ],
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
