import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { IMuscleGroup } from '../models/MuscleGroup';
import { MuscleGroup } from '../entities/muscle-group.entity';

@Injectable()
export class MuscleGroupsRegistryService extends BaseRegistryService<IMuscleGroup> {
  constructor(protected override _dbService: DatabaseService) {
    super(_dbService);
  }

  public async getAll() {
    return await this.dataSource.getRepository(MuscleGroup).find();
  }
}
