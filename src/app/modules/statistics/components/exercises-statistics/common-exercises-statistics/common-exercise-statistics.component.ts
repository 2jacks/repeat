import { Component, OnInit } from '@angular/core';
import { CompletedTrainingRegistryService } from '../../../../training/services/completed-training-registry.service';
import { CompletedTraining } from '../../../../training/entities/completed-training.entity';

@Component({
  selector: 'app-common-exercises-statistics',
  templateUrl: './common-exercise-statistics.component.html',
  styleUrls: ['./common-exercise-statistics.component.scss'],
  standalone: false,
})
export class CommonExerciseStatisticsComponent implements OnInit {
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
}
