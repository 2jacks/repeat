import { Component } from '@angular/core';
import { Exercise } from 'src/app/modules/exercises/entities/exercise.entity';
import { ExercisesRegistryService } from 'src/app/modules/exercises/services/exercises-registry.service';
@Component({
  templateUrl: './exercises-statistics.component.html',
  styleUrls: ['./exercises-statistics.component.scss'],
  standalone: false,
  selector: 'app-exercises-statistics',
})
export class ExercisesStatisticsComponent {
  public exercises: Exercise[] = [];

  public selectedExercise: Exercise | null = null;

  constructor(private exercisesRegistryService: ExercisesRegistryService) {}

  ngOnInit() {
    this.exercisesRegistryService.getAll().then((exercises) => {
      this.exercises = exercises;

      this.selectedExercise = exercises[0]; // TODO: remove
    });
  }

  public onSelectExercise(exercise: Exercise) {
    this.selectedExercise = exercise;
  }

  public clearSelectedExercise() {
    this.selectedExercise = null;
  }

  protected _stringifyExercise(exercise: Exercise) {
    return exercise.name;
  }
}
