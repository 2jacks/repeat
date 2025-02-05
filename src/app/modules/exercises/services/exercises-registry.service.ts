import { Injectable } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-api-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IExercise } from '../models/Exercise';
import { MuscleGroupsService } from '../../muscle-groups/services/muscle-groups.service';
import { TCommonId } from '../../shared/models/CommonId';

@Injectable()
export class ExercisesRegistryService extends BaseRegistryService<IExercise> {
  constructor(
    private dbService: DatabaseService,
    private muscleGroupService: MuscleGroupsService
  ) {
    super(dbService);

    this._collectionName = 'exercises';
  }
}
