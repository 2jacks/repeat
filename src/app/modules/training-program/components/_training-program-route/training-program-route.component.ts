import { Component, WritableSignal } from '@angular/core';
import { TrainingProgram } from '../../entities/training-program.entity';
import { TrainingRegistryService } from 'src/app/modules/training/services/training-registry.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TrainingProgramRegistryService } from '../../services/training-program-registry.service';

@Component({
  selector: 'app-training-program-route',
  templateUrl: './training-program-route.component.html',
  styleUrls: ['./training-program-route.component.scss'],
  standalone: false,
})
export class TrainingProgramRouteComponent {
  trainingsPrograms: WritableSignal<TrainingProgram[]> =
    this.trainingProgramRegistryService.items;

  constructor(
    private trainingProgramRegistryService: TrainingProgramRegistryService,
    private dialogs: TuiDialogService
  ) {}

  async ngOnInit() {
    await this.loadTrainings();
  }

  private async loadTrainings() {
    try {
      this.trainingProgramRegistryService.getAll();
    } catch (error) {
      console.error('Failed to load training programs:', error);
    }
  }

  openCreateTrainingProgramDialog(content: PolymorpheusContent) {
    this.dialogs
      .open(content, {
        size: 'fullscreen',
      })
      .subscribe({
        complete: () => {},
      });
  }
}
