import { Injectable } from '@angular/core';
import { BaseApiService } from '../../shared/services/base-api-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IExercise } from '../models/Exercise';
import { MuscleGroupsService } from '../../muscle-groups/services/muscle-groups.service';
import { TCommonId } from '../../shared/models/CommonId';

@Injectable()
export class ExercisesService extends BaseApiService<IExercise> {
  constructor(
    private dbService: DatabaseService,
    private muscleGroupService: MuscleGroupsService
  ) {
    super(dbService);

    this._collectionName = 'exercises';
  }

  public override getAll(): IExercise[] {
    const exercises = super.getAll();
    exercises.map((exercise) => {
      exercise.muscle_groups = this.replaceIdWithModel(
        this.muscleGroupService,
        exercise.muscle_groups as unknown as TCommonId[]
      );
    });

    return exercises;
  }
}
