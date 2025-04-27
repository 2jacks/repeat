import {
  Component,
  Input,
  WritableSignal,
  effect,
  signal,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { Exercise } from '../../../../exercises/entities/exercise.entity';

import { CompletedTraining } from '../../../../training/entities/completed-training.entity';
import { StatisticsService } from '../../../services/statistics.service';
import { ChartService } from '../../../services/chart.service';

@Component({
  selector: 'app-specific-exercise-statistics',
  templateUrl: './specific-exercise-statistics.component.html',
  styleUrls: ['./specific-exercise-statistics.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecificExerciseStatisticsComponent {
  @Input() exercise!: WritableSignal<Exercise>;
  completedTrainings: CompletedTraining[] = [];

  totalCompletedSets = signal<number>(0);
  weightLoadCompletion = signal<number>(0);
  repsLoadCompletion = signal<number>(0);
  weightProgression = signal<{ date: number; weight: number }[]>([]);
  repsProgression = signal<{ date: number; reps: number }[]>([]);

  constructor(
    private _statisticsService: StatisticsService,
    private _chartService: ChartService,
    private _elementRef: ElementRef
  ) {
    effect(() => {
      this._statisticsService
        .getTotalCompletedSets(this.exercise())
        .then((result) => {
          this.totalCompletedSets.set(result);
        });

      this._statisticsService
        .getWeightLoadCompletion(this.exercise())
        .then((result) => {
          this.weightLoadCompletion.set(result);
        });

      this._statisticsService
        .getRepsLoadCompletion(this.exercise())
        .then((result) => {
          this.repsLoadCompletion.set(result);
        });

      this._statisticsService
        .getWeightProgression(this.exercise())
        .then((result) => {
          this.weightProgression.set(result);
          this._chartService.createWeightProgressionChart(
            this._elementRef.nativeElement.querySelector('#weight-progression'),
            result
          );
        });

      this._statisticsService
        .getRepsProgression(this.exercise())
        .then((result) => {
          this.repsProgression.set(result);
          this._chartService.createRepsProgressionChart(
            this._elementRef.nativeElement.querySelector('#reps-progression'),
            result
          );
        });
    });
  }
}
