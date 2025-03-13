import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IExercise } from '../models/Exercise';
import { MuscleGroupsRegistryService } from '../../muscle-groups/services/muscle-groups-registry.service';
import { TCommonId } from '../../shared/models/CommonId';
import { Exercise } from '../entities/exercise.entity';
import { In, Repository } from 'typeorm';
import { Environment } from 'src/app/environment';
import { MuscleGroup } from '../../muscle-groups/entities/muscle-group.entity';
import { Types } from '../../shared/utils/utils';

@Injectable()
export class ExercisesRegistryService extends BaseRegistryService {
  repository: Repository<Exercise>;

  public items: WritableSignal<Exercise[]> = signal([]);

  constructor(
    private dbService: DatabaseService,
    private muscleGroupRegistryService: MuscleGroupsRegistryService,
    protected override _env: Environment
  ) {
    super(dbService, _env);

    this.repository = this.dataSource.getRepository(Exercise);
  }

  public async getAll(): Types.ServiceResult<Exercise[]> {
    try {
      const res = await this.repository.find({
        relations: {
          muscleGroups: true,
        },
      });

      this.items.set(res);
      return res;
    } catch (err) {
      throw new Error('Failed to get exercises');
    }
  }

  public async getById(id: number): Types.ServiceResult<Exercise | null> {
    try {
      const res = await this.repository.findOne({
        where: { id: id },
        relations: { muscleGroups: true },
      });

      return res;
    } catch (err) {
      throw new Error('Failed to get exercise by id');
    }
  }

  public async create(newItem: Exercise): Types.ServiceResult<Exercise> {
    try {
      const newExercise = new Exercise();
      newExercise.name = newItem.name;
      newExercise.description = newItem.description;
      newExercise.muscleGroups = newItem.muscleGroups;

      const res = await this.repository.save(newExercise);
      await this._saveDataIfWeb();

      await this.getAll();

      return res;
    } catch (err) {
      throw new Error('Failed to create exercise');
    }
  }

  public async update(updatedItem: Exercise): Types.ServiceResult<void> {
    try {
      await this.repository.save(updatedItem);
      await this._saveDataIfWeb();

      return;
    } catch (err) {
      throw new Error('Failed to update exercise');
    } finally {
      await this.getAll();
    }
  }

  public async delete(item: Exercise): Types.ServiceResult<void> {
    try {
      await this.repository.remove(item);
      await this._saveDataIfWeb();

      return;
    } catch (err) {
      throw new Error('Failed to delete exercise');
    } finally {
      await this.getAll();
    }
  }
}
