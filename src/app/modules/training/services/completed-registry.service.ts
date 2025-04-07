import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { CompletedTraining } from '../entities/completed-training.entity';
import { Repository } from 'typeorm';
import { Environment } from 'src/app/environment';
import { Types } from '../../shared/utils/utils';

@Injectable()
export class CompletedRegistryService extends BaseRegistryService {
  repository: Repository<CompletedTraining>;

  public items: WritableSignal<CompletedTraining[]> = signal([]);

  constructor(
    private dbService: DatabaseService,
    protected override _env: Environment
  ) {
    super(dbService, _env);

    this.repository = this.dataSource.getRepository(CompletedTraining);
  }

  public async getAll(): Types.ServiceResult<CompletedTraining[]> {
    try {
      const res = await this.repository.find({
        relations: {
          training: true,
          exercises: true,
        },
        order: {
          date: 'DESC',
        },
      });

      this.items.set(res);
      return res;
    } catch (err) {
      throw new Error('Failed to get completed trainings');
    }
  }

  public async getById(
    id: number
  ): Types.ServiceResult<CompletedTraining | null> {
    try {
      const res = await this.repository.findOne({
        where: { id: id },
        relations: {
          training: true,
          exercises: true,
        },
      });

      return res;
    } catch (err) {
      throw new Error('Failed to get completed training by id');
    }
  }

  public async create(
    newItem: CompletedTraining
  ): Types.ServiceResult<CompletedTraining> {
    try {
      const completedTraining = this.repository.create(newItem);
      const savedCompletedTraining = await this.repository.save(
        completedTraining
      );

      await this._saveDataIfWeb();
      await this.getAll();

      return savedCompletedTraining;
    } catch (err) {
      throw new Error('Failed to create completed training');
    }
  }

  public async update(
    updatedItem: CompletedTraining
  ): Types.ServiceResult<void> {
    try {
      await this.repository.save(updatedItem);
      await this._saveDataIfWeb();
    } catch (err) {
      throw new Error('Failed to update completed training');
    } finally {
      await this.getAll();
    }
  }

  public async delete(item: CompletedTraining): Types.ServiceResult<void> {
    try {
      await this.repository.remove(item);
      await this._saveDataIfWeb();
    } catch (err) {
      throw new Error('Failed to delete completed training');
    } finally {
      await this.getAll();
    }
  }
}
