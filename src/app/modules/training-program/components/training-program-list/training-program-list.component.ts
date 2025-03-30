import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingProgramRegistryService } from '../../services/training-program-registry.service';
import { TrainingProgram } from '../../entities/training-program.entity';
import { getWeekDayName } from 'src/app/modules/shared/utils/utils';

@Component({
  selector: 'app-training-program-list',
  templateUrl: './training-program-list.component.html',
  styleUrls: ['./training-program-list.component.scss'],
  standalone: false,
})
export class TrainingProgramListComponent implements OnInit {
  constructor(
    private trainingProgramRegistry: TrainingProgramRegistryService,
    private router: Router,
    private _route: ActivatedRoute
  ) {}

  get programs() {
    return this.trainingProgramRegistry.items;
  }

  public getWeekDayName(day: number): string {
    return getWeekDayName(day);
  }

  async ngOnInit() {
    await this.loadPrograms();
  }

  onEditClick(program: TrainingProgram) {
    this.router.navigate([program.id, 'edit'], {
      relativeTo: this._route,
    });
  }

  async onDeleteClick(program: TrainingProgram) {
    await this.trainingProgramRegistry.delete(program);
  }

  private async loadPrograms() {
    await this.trainingProgramRegistry.getAll();
  }
}
