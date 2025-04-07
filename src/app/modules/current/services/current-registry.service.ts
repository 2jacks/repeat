import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Environment } from 'src/app/environment';
import { Repository } from 'typeorm';
import { Types } from '../../shared/utils/utils';
import { Current } from '../entities/current.entity';
import { TrainingProgram } from '../../training-program/entities/training-program.entity';

@Injectable()
export class CurrentRegistryService extends BaseRegistryService {
  repository: Repository<Current>;
  public items: WritableSignal<Current[]> = signal([]);

  constructor(
    private dbService: DatabaseService,
    protected override _env: Environment
  ) {
    super(dbService, _env);
    this.repository = this.dataSource.getRepository(Current);
  }

  public async getCurrent(): Types.ServiceResult<Current | null> {
    try {
      const res = await this.repository.findOne({
        where: { id: 1 },
        relations: [
          'activeTrainingProgram',
          'activeTrainingProgram.trainings',
          'activeTrainingProgram.trainings.training',
          'activeTrainingProgram.trainings.training.exercises',
          'activeTrainingProgram.trainings.training.exercises.exercise',
        ],
      });

      if (res) {
        this.items.set([res]);
      }

      return res;
    } catch (err) {
      throw new Error('Failed to get current state');
    }
  }

  public async setActiveTrainingProgram(
    program: TrainingProgram
  ): Types.ServiceResult<void> {
    try {
      await this.repository.update(1, {
        activeTrainingProgram: program,
        trainingProgramStart: Date.now(),
      });

      await this._saveDataIfWeb();
      await this.getCurrent();
    } catch (err) {
      throw new Error('Failed to update active training program');
    }
  }

  public getTrainingProgramEndDate(
    startTimestamp: number | null,
    durationWeeks: number
  ): number | null {
    if (!startTimestamp) return null;

    const endDate = new Date(startTimestamp);
    endDate.setDate(endDate.getDate() + durationWeeks * 7);
    return endDate.getTime();
  }
}
