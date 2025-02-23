import { Injectable } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IExercise } from '../models/Exercise';
import { MuscleGroupsRegistryService } from '../../muscle-groups/services/muscle-groups-registry.service';
import { TCommonId } from '../../shared/models/CommonId';
import { Exercise } from '../entities/exercise.entity';
import { In, Repository } from 'typeorm';
import { Environment } from 'src/app/environment';
import { MuscleGroup } from '../../muscle-groups/entities/muscle-group.entity';

@Injectable()
export class ExercisesRegistryService extends BaseRegistryService {
  repository: Repository<Exercise>;

  constructor(
    private dbService: DatabaseService,
    private muscleGroupRegistryService: MuscleGroupsRegistryService,
    protected override _env: Environment
  ) {
    super(dbService, _env);

    this.repository = this.dataSource.getRepository(Exercise);
  }
  public async getAll(): Promise<Exercise[]> {
    return await this.repository.find({
      relations: {
        muscleGroups: true,
      },
    });
  }

  public async create(newItem: Exercise): Promise<Exercise | Error> {
    const newExercise = new Exercise();

    newExercise.name = newItem.name;
    newExercise.description = newItem.description;
    newExercise.muscleGroups = await this.dataSource
      .getRepository(MuscleGroup)
      .find({
        where: {
          id: In(newItem.muscleGroups),
        },
      });

    try {
      const res = await this.repository.save(newExercise);
      await this._saveDataIfWeb();

      return res;
    } catch (err) {
      return new Error();
    }
  }
}
