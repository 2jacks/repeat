import { Component, OnInit, signal } from '@angular/core';
import { ExercisesRegistryService } from '../../services/exercises-registry.service';
import { IExercise } from '../../models/Exercise';
import { MuscleGroupsRegistryService } from 'src/app/modules/muscle-groups/services/muscle-groups-registry.service';
import { Exercise } from '../../entities/exercise.entity';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss'],
  standalone: false,
})
export class ExercisesListComponent implements OnInit {
  public exercises = signal<Exercise[]>([]);

  constructor(
    private _exercisesRegistryService: ExercisesRegistryService,
    private _muscleGroupRegistryService: MuscleGroupsRegistryService
  ) {}

  ngOnInit() {
    this._muscleGroupRegistryService.getAll().then((res) => {
      console.log(res);
    });
    this._exercisesRegistryService.getAll().then((res) => {
      console.log(res);
      this.exercises.set(res);
    });
  }
}
