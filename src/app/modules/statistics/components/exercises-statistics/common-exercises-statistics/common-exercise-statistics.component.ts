import { Component, OnInit, signal } from '@angular/core';
import { CompletedTrainingRegistryService } from '../../../../training/services/completed-training-registry.service';
import { CompletedTraining } from '../../../../training/entities/completed-training.entity';
import { StatisticsService } from '../../../services/statistics.service';
import { Exercise } from '../../../../exercises/entities/exercise.entity';

@Component({
  selector: 'app-common-exercises-statistics',
  templateUrl: './common-exercise-statistics.component.html',
  styleUrls: ['./common-exercise-statistics.component.scss'],
  standalone: false,
})
export class CommonExerciseStatisticsComponent implements OnInit {
  completedTrainings: CompletedTraining[] = [];

  mostPopularExercise = signal<{
    exercise: Exercise;
    totalSets: number;
  } | null>(null);
  exerciseWithMaxWeight = signal<{
    exercise: Exercise;
    maxWeight: number;
  } | null>(null);
  exerciseWithMaxProgression = signal<{
    exercise: Exercise;
    progression: number;
  } | null>(null);
  trainingsLastMonth = signal<number>(0);
  missedTrainings = signal<number>(0);

  constructor(
    private completedTrainingService: CompletedTrainingRegistryService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private async loadStatistics(): Promise<void> {
    try {
      // Загружаем статистику
      const [mostPopular, maxWeight, maxProgression, lastMonth, missed] =
        await Promise.all([
          this.statisticsService.getMostPopularExercise(),
          this.statisticsService.getExerciseWithMaxWeight(),
          this.statisticsService.getExerciseWithMaxProgression(),
          this.statisticsService.getTrainingsCountLastMonth(),
          this.statisticsService.getMissedTrainingsCount(),
        ]);

      this.mostPopularExercise.set(mostPopular);
      this.exerciseWithMaxWeight.set(maxWeight);
      this.exerciseWithMaxProgression.set(maxProgression);
      this.trainingsLastMonth.set(lastMonth);
      this.missedTrainings.set(missed);
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
    }
  }
}
