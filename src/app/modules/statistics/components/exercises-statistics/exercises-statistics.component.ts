import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Exercise } from 'src/app/modules/exercises/entities/exercise.entity';
import { ExercisesRegistryService } from 'src/app/modules/exercises/services/exercises-registry.service';
@Component({
  templateUrl: './exercises-statistics.component.html',
  styleUrls: ['./exercises-statistics.component.scss'],
  standalone: false,
  selector: 'app-exercises-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesStatisticsComponent {
  public exercises: Exercise[] = [];

  public selectedExercise = signal<Exercise | null>(null);

  constructor(private exercisesRegistryService: ExercisesRegistryService) {}

  ngOnInit() {
    this.exercisesRegistryService.getAll().then((exercises) => {
      this.exercises = exercises;
    });
  }

  public onSelectExercise(exercise: Exercise) {
    this.selectedExercise.set(exercise);
  }

  public clearSelectedExercise() {
    this.selectedExercise.set(null);
  }

  protected _stringifyExercise(exercise: Exercise) {
    return exercise.name;
  }
}
