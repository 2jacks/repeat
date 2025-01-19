import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service';
import { BaseService } from '../../shared/services/base-service.service';

@Injectable()
export class MuscleGroupsService extends BaseService {
  constructor(protected override _dbService: DatabaseService) {
    super(_dbService);
    this._collectionName = 'muscle_groups';
    this._requiredCollection();
  }
}
