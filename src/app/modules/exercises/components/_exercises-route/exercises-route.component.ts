import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tuiDialog, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';

import { CreateEditExerciseFormComponent } from '../create-edit-exercise/create-edit-exercise-form.component';

@Component({
  selector: 'app-exercises-route',
  templateUrl: './exercises-route.component.html',
  styleUrls: ['./exercises-route.component.scss'],
  standalone: false,
})
export class ExercisesRouteComponent {
  constructor(private router: Router, private dialogs: TuiDialogService) {}

  private readonly createExerciseFormDialog = tuiDialog(
    CreateEditExerciseFormComponent,
    {
      size: 'page',
      closeable: true,
      dismissible: true,
    }
  );

  public openCreateExerciseDialog(content: PolymorpheusContent) {
    this.dialogs.open(content).subscribe({
      complete: () => {},
    });
  }
  closeCreateExerciseDialog() {}
}
