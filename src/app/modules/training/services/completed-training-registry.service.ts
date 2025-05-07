import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { CompletedTraining } from '../entities/completed-training.entity';
import { Repository } from 'typeorm';
import { Environment } from 'src/app/environment';
import { Types } from '../../shared/utils/utils';
import { Training } from '../entities/training.entity';
import { CompletedExercise } from '../entities/completed-exercise.entity';
import { CompletedExerciseSet } from '../../exercises/entities/completed-exercise-set.entity';
import { Set } from '../../exercises/entities/set.entity';

@Injectable()
export class CompletedTrainingRegistryService extends BaseRegistryService {
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
          templateTraining: {
            exercises: {
              exercise: true,
              sets: {
                set: true,
              },
            },
          },
          exercises: {
            exercise: true,
            sets: {
              set: true,
            },
          },
        },
        order: {
          date: 'DESC',

          exercises: {
            sets: {
              set: {
                number: 'ASC',
              },
            },
          },
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
          templateTraining: true,
          exercises: true,
        },
      });

      return res;
    } catch (err) {
      throw new Error('Failed to get completed training by id');
    }
  }

  public async create(
    completedTraining: CompletedTraining
  ): Types.ServiceResult<CompletedTraining> {
    try {
      // Создаем запись о завершенной тренировке
      const newCompletedTraining = this.repository.create({
        templateTraining: completedTraining.templateTraining,
        date: completedTraining.date,
      });
      const savedCompletedTraining = await this.repository.save(
        newCompletedTraining
      );

      // Создаем упражнения и подходы
      for (const exercise of completedTraining.exercises) {
        // Создаем запись о завершенном упражнении
        const completedExercise = this.dataSource
          .getRepository(CompletedExercise)
          .create({
            completedTraining: savedCompletedTraining,
            exercise: exercise.exercise,
          });
        const savedCompletedExercise = await this.dataSource
          .getRepository(CompletedExercise)
          .save(completedExercise);

        // Создаем подходы и связываем их с упражнением
        for (const set of exercise.sets) {
          // Создаем запись о подходе
          const newSet = this.dataSource.getRepository(Set).create({
            number: set.set.number,
            reps: set.set.reps,
            weight: set.set.weight,
            rest: set.set.rest,
          });
          const savedSet = await this.dataSource
            .getRepository(Set)
            .save(newSet);

          // Создаем связь между подходом и упражнением
          const completedExerciseSet = this.dataSource
            .getRepository(CompletedExerciseSet)
            .create({
              completedExercise: savedCompletedExercise,
              set: savedSet,
            });
          await this.dataSource
            .getRepository(CompletedExerciseSet)
            .save(completedExerciseSet);
        }
      }

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
