import { NgModule } from '@angular/core';
import { TuiInputFiles } from '@taiga-ui/kit';

const MODULES = [TuiInputFiles] as any[];

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class TaigaUiModule {}
