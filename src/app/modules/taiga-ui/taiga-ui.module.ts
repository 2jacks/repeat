import { NgModule } from '@angular/core';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiIcon,
  TuiLoader,
  tuiLoaderOptionsProvider,
  TuiSelect,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiBadge,
  TuiDataListWrapper,
  TuiInputFiles,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import { TuiAppBar, TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import {
  TuiMultiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

const MODULES = [
  TuiInputFiles,
  TuiLoader,
  TuiAppBar,
  TuiTabBar,
  TuiCardLarge,
  TuiTitle,
  TuiHeader,
  TuiBadge,
  TuiIcon,
  TuiButton,
  TuiForm,
  TuiTextfield,
  TuiSelect,
  TuiDataList,
  TuiDataListWrapper,
  TuiMultiSelectModule,
  TuiTextfieldControllerModule,
  TuiStringifyContentPipe,
  TuiAppearance,
] as any[];

@NgModule({
  imports: MODULES,
  exports: MODULES,
  providers: [
    tuiLoaderOptionsProvider({
      size: 'l',
      inheritColor: false,
      overlay: true,
    }),
  ],
})
export class TaigaUiModule {}
