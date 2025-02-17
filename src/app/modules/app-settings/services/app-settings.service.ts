import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';

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
  }

  public get(key: string): any {}
  public set(key: string, value: any): void {}
}
