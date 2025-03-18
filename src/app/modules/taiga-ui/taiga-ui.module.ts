import { NgModule } from '@angular/core';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiIcon,
  TuiLink,
  TuiLoader,
  tuiLoaderOptionsProvider,
  TuiSelect,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';

import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import {
  TuiBadge,
  TuiDataListWrapper,
  TuiInputFiles,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import {
  TuiAppBar,
  TuiCardLarge,
  TuiCell,
  TuiForm,
  TuiHeader,
} from '@taiga-ui/layout';
import {
  TuiSwipeActions,
  TuiSwipeActionsAutoClose,
  TuiTabBar,
} from '@taiga-ui/addon-mobile';
import {
  TuiMultiSelectModule,
  TuiTextareaComponent,
  TuiTextareaModule,
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
  TuiTextareaModule,
  TuiSwipeActions,
  TuiSwipeActionsAutoClose,
  TuiCell,
  TuiDropdown,
  TuiLink,
  TuiObscured,
  TuiActiveZone,
  // TuiTextareaComponent,
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
