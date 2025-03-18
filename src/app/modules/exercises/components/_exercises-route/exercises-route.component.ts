import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tuiDialog, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';

import { CreateEditExerciseFormComponent } from '../create-edit-exercise-form/create-edit-exercise-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exercises-route',
  templateUrl: './exercises-route.component.html',
  styleUrls: ['./exercises-route.component.scss'],
  standalone: false,
})
export class ExercisesRouteComponent {
  constructor(private router: Router, private dialogs: TuiDialogService) {}

  public openCreateExerciseDialog(content: PolymorpheusContent) {
    this.dialogs
      .open(content, {
        size: 'fullscreen',
      })
      .subscribe({
        complete: () => {},
      });
  }
  closeCreateExerciseDialog() {}
}
