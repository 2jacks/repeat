import { Component, OnInit, Input } from '@angular/core';
import { Exercise } from '../../../../exercises/entities/exercise.entity';
import { CompletedTrainingRegistryService } from '../../../../training/services/completed-training-registry.service';
import { CompletedTraining } from '../../../../training/entities/completed-training.entity';

@Component({
  selector: 'app-specific-exercise-statistics',
  templateUrl: './specific-exercise-statistics.component.html',
  styleUrls: ['./specific-exercise-statistics.component.scss'],
  standalone: false,
})
export class SpecificExerciseStatisticsComponent implements OnInit {
  @Input() exercise!: Exercise;
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
