import { Component, OnInit, signal } from '@angular/core';
import { ExercisesService } from '../../services/exercises.service';
import { IExercise } from '../../models/Exercise';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss'],
  standalone: false,
})
export class ExercisesListComponent implements OnInit {
  public exercises = signal<IExercise[]>([]);

  constructor(private _apiService: ExercisesService) {}

  ngOnInit() {
    this.exercises.set(this._apiService.getAll());
  }
}
