import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { BaseRegistryService } from '../../shared/services/base-api-service.service';

export type TAppSettingKey = string;
export type TAppSettingValue = any;
export interface IAppSettingRecord {
  key: TAppSettingKey;
  value: TAppSettingValue;
}

@Injectable()
export class AppSettingsService extends BaseRegistryService {
  private _appSettings: IAppSettingRecord[] = [];

  constructor(protected override _dbService: DatabaseService) {
    super(_dbService);
    this._collectionName = 'app_settings';
    this._requiredCollection();
  }

  public get(key: string): any {}
  public set(key: string, value: any): void {}
}
