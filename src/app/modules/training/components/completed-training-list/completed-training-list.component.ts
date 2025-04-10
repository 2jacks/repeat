import { Component, OnInit } from '@angular/core';
import { CompletedTraining } from '../../entities/completed-training.entity';
import { CompletedRegistryService } from '../../services/completed-training-registry.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-completed-training-list',
  standalone: false,
  templateUrl: './completed-training-list.component.html',
  styleUrls: ['./completed-training-list.component.scss'],
  providers: [CompletedRegistryService],
})
export class CompletedTrainingListComponent implements OnInit {
  completedTrainings: CompletedTraining[] = [];

  constructor(private completedTrainingService: CompletedRegistryService) {}

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
}
