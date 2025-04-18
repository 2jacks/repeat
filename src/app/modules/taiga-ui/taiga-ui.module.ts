import { NgModule } from '@angular/core';
import {
  TuiAppearance,
  TuiButton,
  TuiCalendar,
  TuiDataList,
  TuiDialog,
  TuiDropdown,
  TuiExpand,
  TuiIcon,
  TuiLink,
  TuiLoader,
  tuiLoaderOptionsProvider,
  TuiSelect,
  TuiSurface,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';

import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import {
  TuiAccordion,
  TuiBadge,
  TuiChip,
  TuiDataListWrapper,
  TuiInputFiles,
  TuiStringifyContentPipe,
  TuiInputNumber,
  TuiTabs,
} from '@taiga-ui/kit';
import {
  TuiAppBar,
  TuiCardLarge,
  TuiCardMedium,
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
  TuiComboBoxModule,
  TuiMultiSelectModule,
  TuiSelectModule,
  TuiTextareaModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

const MODULES = [
  TuiInputFiles,
  TuiLoader,
  TuiAppBar,
  TuiTabBar,
  TuiCardLarge,
  TuiCardMedium,
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
  TuiAccordion,
  TuiExpand,
  TuiSelectModule,
  TuiSurface,
  TuiChip,
  TuiInputNumber,
  TuiComboBoxModule,
  TuiCalendar,
  TuiDialog,
  TuiTabs,
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
