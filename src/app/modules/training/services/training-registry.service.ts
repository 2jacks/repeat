import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Training } from '../entities/training.entity';
import { Repository } from 'typeorm';
import { Environment } from 'src/app/environment';
import { Types } from '../../shared/utils/utils';

@Injectable()
export class TrainingRegistryService extends BaseRegistryService {
  repository: Repository<Training>;

  public items: WritableSignal<Training[]> = signal([]);

  constructor(
    private dbService: DatabaseService,
    protected override _env: Environment
  ) {
    super(dbService, _env);

    this.repository = this.dataSource.getRepository(Training);
  }

  public async getAll(): Types.ServiceResult<Training[]> {
    try {
      const res = await this.repository.find({
        relations: {
          trainingExercises: {
            exercise: {
              muscleGroups: true,
            },
          },
        },
      });

      this.items.set(res);
      return res;
    } catch (err) {
      throw new Error('Failed to get trainings');
    }
  }

  public async getById(id: number): Types.ServiceResult<Training | null> {
    try {
      const res = await this.repository.findOne({
        where: { id: id },
        relations: {
          trainingExercises: {
            exercise: {
              muscleGroups: true,
            },
          },
        },
      });

      return res;
    } catch (err) {
      throw new Error('Failed to get training by id');
    }
  }

  public async create(newItem: Training): Types.ServiceResult<Training> {
    try {
      const res = await this.repository.save(newItem);
      await this._saveDataIfWeb();

      await this.getAll();

      return res;
    } catch (err) {
      throw new Error('Failed to create training');
    }
  }

  public async update(updatedItem: Training): Types.ServiceResult<void> {
    try {
      await this.repository.save(updatedItem);
      await this._saveDataIfWeb();

      return;
    } catch (err) {
      throw new Error('Failed to update training');
    } finally {
      await this.getAll();
    }
  }

  public async delete(item: Training): Types.ServiceResult<void> {
    try {
      await this.repository.remove(item);
      await this._saveDataIfWeb();

      return;
    } catch (err) {
      throw new Error('Failed to delete training');
    } finally {
      await this.getAll();
    }
  }
}
