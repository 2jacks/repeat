import { Component, OnInit } from '@angular/core';
import { Exercise } from 'src/app/modules/exercises/entities/exercise.entity';
import { CompletedExercise } from 'src/app/modules/training/entities/completed-exercise.entity';
import { CompletedExerciseSet } from 'src/app/modules/exercises/entities/completed-exercise-set.entity';
import { CompletedTraining } from 'src/app/modules/training/entities/completed-training.entity';
import { TrainingExercise } from 'src/app/modules/training/entities/training-exercise.entity';
import { CompletedTrainingRegistryService } from 'src/app/modules/training/services/completed-training-registry.service';
import { TrainingExerciseSet } from 'src/app/modules/exercises/entities/training-exercise-set.entity';

@Component({
  selector: 'app-completed-training-list',
  standalone: false,
  templateUrl: './completed-training-list.component.html',
  styleUrls: ['./completed-training-list.component.scss'],
})
export class CompletedTrainingListComponent implements OnInit {
  completedTrainings: CompletedTraining[] = [];

  constructor(
    private completedTrainingService: CompletedTrainingRegistryService
  ) {}

  ngOnInit(): void {
    this.loadCompletedTrainings();
  }

  private async loadCompletedTrainings(): Promise<void> {
    try {
      this.completedTrainings = await this.completedTrainingService.getAll();
    } catch (error) {
      console.error('Ошибка при загрузке завершенных тренировок:', error);
    }
  }

  getTotalExercises(completedTraining: CompletedTraining): number {
    return completedTraining.exercises?.length || 0;
  }

  getTemplateExerciseSet(
    training: CompletedTraining,
    exercise: CompletedExercise,
    set: CompletedExerciseSet
  ): TrainingExerciseSet | null {
    if (!training.templateTraining) {
      return null;
    }

    const templateExercise = training.templateTraining.exercises.find(
      (e) => e.exercise.id === exercise.exercise.id
    );

    if (!templateExercise) {
      return null;
    }

    const templateSet = templateExercise.sets.find(
      (s) => s.set.number === set.set.number
    );

    return templateSet || null;
  }
}
