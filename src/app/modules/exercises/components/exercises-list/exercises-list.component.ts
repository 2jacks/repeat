import {
  ChangeDetectorRef,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { ExercisesRegistryService } from '../../services/exercises-registry.service';
import { IExercise } from '../../models/Exercise';
import { MuscleGroupsRegistryService } from 'src/app/modules/muscle-groups/services/muscle-groups-registry.service';
import { Exercise } from '../../entities/exercise.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss'],
  standalone: false,
})
export class ExercisesListComponent implements OnInit {
  public exercises = this._exercisesRegistryService.items;

  constructor(
    private _exercisesRegistryService: ExercisesRegistryService,
    private _muscleGroupRegistryService: MuscleGroupsRegistryService,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._muscleGroupRegistryService.getAll().then((res) => {});
    this._exercisesRegistryService.getAll().then((res) => {
      this.exercises = this._exercisesRegistryService.items;
    });
  }

  public onEditButtonClick(exercise: Exercise) {
    this._router.navigate([`/exercises/${exercise.id}/edit`]);
  }

  public onDeleteButtonClick(exercise: Exercise) {
    this._exercisesRegistryService.delete(exercise);
  }
}
