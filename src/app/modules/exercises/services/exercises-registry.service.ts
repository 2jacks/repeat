import { Injectable } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IExercise } from '../models/Exercise';
import { MuscleGroupsRegistryService } from '../../muscle-groups/services/muscle-groups-registry.service';
import { TCommonId } from '../../shared/models/CommonId';

@Injectable()
export class ExercisesRegistryService extends BaseRegistryService<IExercise> {
  constructor(
    private dbService: DatabaseService,
    private muscleGroupRegistryService: MuscleGroupsRegistryService
  ) {
    super(dbService);

    this._collectionName = 'exercises';
  }

  public override async getAll(): Promise<IExercise[]> {
    const query = `SELECT 
    e.id AS id,
    e.name AS name,
    e.description AS description,
        json_group_array(
            json_object('id', mg.id, 'name', mg.name)
        ) AS muscle_groups
        FROM 
          exercises e
        LEFT JOIN 
            muscle_group_exercises emg ON e.id = emg.exercise_id
        LEFT JOIN 
            muscle_groups mg ON emg.muscle_group_id = mg.id
        GROUP BY 
            e.id, e.name, e.description;
    `;

    const res =
      ((await this._dbService.getDatabaseConnection().query(query))
        .values as any[]) ?? [];

    res.forEach((row) => {
      row.muscle_groups = JSON.parse(row.muscle_groups);
    });

    return res;
  }

  public override async create(newRecords: IExercise[]): Promise<void> {
    // Генерация SQL-запроса
    const placeholders = newRecords.map(() => '(?, ?)').join(', ');
    const values = newRecords.map((record) => [
      record.name,
      record.description,
    ]);

    // Вставка данных
    const res = await this.db.run(
      `INSERT INTO exercises (name, description) VALUES ${placeholders}`,
      values
    );

    console.log('INSERT EXER', res);
    return;
  }
}
