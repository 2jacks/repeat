import { Component, OnInit } from '@angular/core';
import { TrainingRegistryService } from '../../services/training-registry.service';
import { Training } from '../../entities/training.entity';

@Component({
  selector: 'app-training-route',
  templateUrl: './training-route.component.html',
  styleUrls: ['./training-route.component.scss'],
  standalone: false,
})
export class TrainingRouteComponent implements OnInit {
  trainings: Training[] = [];

  constructor(private trainingRegistryService: TrainingRegistryService) {}

  async ngOnInit() {
    await this.loadTrainings();
  }

  private async loadTrainings() {
    try {
      this.trainings = await this.trainingRegistryService.getAll();
    } catch (error) {
      console.error('Failed to load trainings:', error);
    }
  }
}
