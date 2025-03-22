import { Component, OnInit } from '@angular/core';
import { TrainingRegistryService } from '../../services/training-registry.service';
import { Training } from '../../entities/training.entity';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';

@Component({
  selector: 'app-training-route',
  templateUrl: './training-route.component.html',
  styleUrls: ['./training-route.component.scss'],
  standalone: false,
})
export class TrainingRouteComponent implements OnInit {
  trainings: Training[] = [];

  constructor(
    private trainingRegistryService: TrainingRegistryService,
    private dialogs: TuiDialogService
  ) {}

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

  openCreateTrainingDialog(content: PolymorpheusContent) {
    this.dialogs
      .open(content, {
        size: 'fullscreen',
      })
      .subscribe({
        complete: () => {},
      });
  }
}
