import { Component, OnInit } from '@angular/core';
import { TrainingRegistryService } from '../../services/training-registry.service';
import { Training } from '../../entities/training.entity';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss'],
  standalone: false,
})
export class TrainingListComponent implements OnInit {
  public trainings = this.trainingRegistryService.items;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private trainingRegistryService: TrainingRegistryService
  ) {}

  ngOnInit() {
    this.trainingRegistryService.getAll().then((res) => {
      console.log(res);
    });
  }

  public onEditButtonClick(exercise: Training) {
    this._router.navigate([exercise.id, 'edit'], { relativeTo: this._route });
  }

  public onDeleteButtonClick(exercise: Training) {
    this.trainingRegistryService.delete(exercise);
  }
}
