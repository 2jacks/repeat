import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { IMuscleGroup } from '../models/MuscleGroup';

@Injectable()
export class MuscleGroupsRegistryService extends BaseRegistryService<IMuscleGroup> {
  constructor(protected override _dbService: DatabaseService) {
    super(_dbService);
    this._collectionName = 'muscle_groups';
  }
}
