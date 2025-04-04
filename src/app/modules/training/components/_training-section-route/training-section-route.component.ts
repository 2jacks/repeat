import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TrainingRegistryService } from '../../services/training-registry.service';
import { Training } from '../../entities/training.entity';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';

@Component({
  selector: 'app-training-section-route',
  templateUrl: './training-section-route.component.html',
  styleUrls: ['./training-section-route.component.scss'],
  standalone: false,
})
export class TrainingSectionRouteComponent implements OnInit {
  trainings: Training[] = [];

  isDialogOpen: boolean = false;

  @ViewChild('createTrainingFormModal')
  createTrainingFormModal!: TemplateRef<PolymorpheusContent>;

  constructor(
    private trainingRegistryService: TrainingRegistryService,
    private dialogs: TuiDialogService
  ) {}

  async ngOnInit() {
    await this.loadTrainings();
  }

  onNewTrainingFormSubmit(value: Training) {
    console.log(value);
    this.trainingRegistryService.create(value);
    this.isDialogOpen = false;
  }

  openCreateTrainingDialog() {
    this.isDialogOpen = true;
  }

  private async loadTrainings() {
    try {
      this.trainings = await this.trainingRegistryService.getAll();
    } catch (error) {
      console.error('Failed to load trainings:', error);
    }
  }
}
