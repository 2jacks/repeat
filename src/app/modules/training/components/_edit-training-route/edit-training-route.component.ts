import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Training } from '../../entities/training.entity';
import { TrainingRegistryService } from '../../services/training-registry.service';

@Component({
  selector: 'app-edit-training-route',
  templateUrl: './edit-training-route.component.html',
  standalone: false,
})
export class EditTrainingRouteComponent implements OnInit {
  training?: Training;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingRegistryService: TrainingRegistryService
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/trainings']);
      return;
    }

    try {
      const res = await this.trainingRegistryService.getById(id);
      if (!res) {
        this.router.navigate(['/workout/training']);
        return;
      }
      this.training = res;
    } catch (error) {
      console.error('Failed to load training:', error);
      this.router.navigate(['/workout/training']);
    }
  }

  async handleSubmit(training: Training) {
    try {
      await this.trainingRegistryService.update(training);
      this.router.navigate(['/workout/training']);
    } catch (error) {
      console.error('Failed to update training:', error);
    }
  }

  handleCancel() {
    this.router.navigate(['/workout/training']);
  }
}
