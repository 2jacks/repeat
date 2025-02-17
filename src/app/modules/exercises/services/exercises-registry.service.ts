import { Injectable } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IExercise } from '../models/Exercise';
import { MuscleGroupsRegistryService } from '../../muscle-groups/services/muscle-groups-registry.service';
import { TCommonId } from '../../shared/models/CommonId';
import { Exercise } from '../entities/exercise.entity';

@Injectable()
export class ExercisesRegistryService extends BaseRegistryService<IExercise> {
  constructor(
    private dbService: DatabaseService,
    private muscleGroupRegistryService: MuscleGroupsRegistryService
  ) {
    super(dbService);
  }
  public async getAll(): Promise<Exercise[]> {
    return await this.dataSource.getRepository(Exercise).find({
      relations: {
        muscleGroups: true,
      },
    });
  }
}
