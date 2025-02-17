import { Component, OnInit, signal } from '@angular/core';
import { ExercisesRegistryService } from '../../services/exercises-registry.service';
import { IExercise } from '../../models/Exercise';
import { MuscleGroupsRegistryService } from 'src/app/modules/muscle-groups/services/muscle-groups-registry.service';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss'],
  standalone: false,
})
export class ExercisesListComponent implements OnInit {
  public exercises = signal<IExercise[]>([]);

  constructor(
    private _registryService: ExercisesRegistryService,
    private _muscleGroupRegistryService: MuscleGroupsRegistryService
  ) {}

  ngOnInit() {
    this._muscleGroupRegistryService.getAll().then((res) => {
      console.log(res);
    });
  }
}
