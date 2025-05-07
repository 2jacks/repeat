
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Training } from '../entities/training.entity';
import { Repository } from 'typeorm';
import { Environment } from 'src/app/environment';
import { Types } from '../../shared/utils/utils';
import { TrainingExercise } from '../entities/training-exercise.entity';
import { Set } from '../../exercises/entities/set.entity';
import { TrainingExerciseSet } from '../../exercises/entities/training-exercise-set.entity';

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
          exercises: {
            exercise: true,
            sets: {
              set: true,
            },
          },
        },
        order: {
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
      throw new Error('Failed to get trainings');
    }
  }

  public async getById(id: number): Types.ServiceResult<Training | null> {
    try {
      const res = await this.repository.findOne({
        where: { id: id },
        relations: {
          exercises: {
            exercise: {
              muscleGroups: true,
            },
            sets: {
              set: true,
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
      // Сначала создаем тренировку без упражнений
      const training = this.repository.create({
        name: newItem.name,
      });
      const savedTraining = await this.repository.save(training);

      // Создаем упражнения и подходы
      for (const te of newItem.exercises) {
        // Создаем запись в таблице training_to_exercise
        const trainingExercise = this.dataSource
          .getRepository(TrainingExercise)
          .create({
            training: savedTraining,
            exercise: te.exercise,
          });
        const savedTrainingExercise = await this.dataSource
          .getRepository(TrainingExercise)
          .save(trainingExercise);

        // Создаем подходы и связываем их с упражнением
        for (const set of te.sets) {
          // Создаем запись в таблице set
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
          const exerciseset = this.dataSource
            .getRepository(TrainingExerciseSet)
            .create({
              exercise: savedTrainingExercise,
              set: savedSet,
            });
          await this.dataSource
            .getRepository(TrainingExerciseSet)
            .save(exerciseset);
        }
      }

      await this._saveDataIfWeb();
      await this.getAll();

      return savedTraining;
    } catch (err) {
      throw new Error('Failed to create training');
    }
  }

  public async update(updatedItem: Training): Types.ServiceResult<void> {
    try {
      // Получаем текущую версию тренировки из БД со всеми связями
      const currentTraining = await this.repository.findOne({
        where: { id: updatedItem.id },
        relations: {
          exercises: {
            exercise: true,
            sets: {
              set: true,
            },
          },
        },
      });

      if (!currentTraining) {
        throw new Error('Training not found');
      }

      // Обновляем основные данные тренировки
      currentTraining.name = updatedItem.name;
      await this.repository.save(currentTraining);

      const trainingExerciseRepo =
        this._dbService.dataSource.getRepository(TrainingExercise);
      const setRepo = this._dbService.dataSource.getRepository(Set);
      const exercisesetRepo =
        this._dbService.dataSource.getRepository(TrainingExerciseSet);

      // Удаляем упражнения, которых больше нет в обновленной версии
      const exercisesToDelete = currentTraining.exercises.filter(
        (currentTE) =>
          !updatedItem.exercises.some(
            (updatedTE) => updatedTE.id === currentTE.id
          )
      );

      if (exercisesToDelete.length > 0) {
        await trainingExerciseRepo.remove(exercisesToDelete);
      }

      // Обновляем существующие и создаем новые упражнения
      for (const updatedTE of updatedItem.exercises) {
        if (updatedTE.id) {
          // Обновляем существующее упражнение
          const existingTE = await trainingExerciseRepo.findOne({
            where: { id: updatedTE.id },
          });

          if (existingTE) {
            existingTE.exercise = updatedTE.exercise;
            existingTE.training = currentTraining;
            await trainingExerciseRepo.save(existingTE);
          }

          // Удаляем старые подходы
          const oldSets = await exercisesetRepo.find({
            where: { exercise: { id: updatedTE.id } },
          });
          await exercisesetRepo.remove(oldSets);

          // Создаем новые подходы
          for (const set of updatedTE.sets) {
            const newSet = setRepo.create({
              number: set.set.number,
              reps: set.set.reps,
              weight: set.set.weight,
              rest: set.set.rest,
            });
            const savedSet = await setRepo.save(newSet);

            const exerciseset = exercisesetRepo.create({
              exercise: { id: updatedTE.id },
              set: savedSet,
            });
            await exercisesetRepo.save(exerciseset);
          }
        } else {
          // Создаем новое упражнение
          const newTE = trainingExerciseRepo.create({
            training: currentTraining,
            exercise: updatedTE.exercise,
          });
          const savedTE = await trainingExerciseRepo.save(newTE);

          // Создаем подходы для нового упражнения
          for (const set of updatedTE.sets) {
            const newSet = setRepo.create({
              number: set.set.number,
              reps: set.set.reps,
              weight: set.set.weight,
              rest: set.set.rest,
            });
            const savedSet = await setRepo.save(newSet);

            const exerciseset = exercisesetRepo.create({
              exercise: savedTE,
              set: savedSet,
            });
            await exercisesetRepo.save(exerciseset);
          }
        }
      }

      await this._saveDataIfWeb();
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
