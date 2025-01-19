import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/services/database.service';
import { BaseService } from '../../shared/services/base-service.service';

export type TAppSettingKey = string;
export type TAppSettingValue = any;
export interface IAppSettingRecord {
  key: TAppSettingKey;
  value: TAppSettingValue;
}

@Injectable()
export class AppSettingsService extends BaseService {
  private _appSettings: IAppSettingRecord[] = [];

  constructor(protected override _dbService: DatabaseService) {
    super(_dbService);
    this._collectionName = 'app_settings';
    this._requiredCollection();
  }

  public get(key: string): any {}
  public set(key: string, value: any): void {}
}
