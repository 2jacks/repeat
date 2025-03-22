import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Training } from '../entities/training.entity';
import { Repository } from 'typeorm';
import { Environment } from 'src/app/environment';
import { Types } from '../../shared/utils/utils';
import { TrainingExercise } from '../entities/training-exercise.entity';

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
          trainingExercises: {
            exercise: {
              muscleGroups: true,
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
          trainingExercises: {
            exercise: {
              muscleGroups: true,
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

      // Теперь создаем записи в промежуточной таблице
      const exercises = newItem.trainingExercises.map((te) => {
        const trainingExercise = new TrainingExercise();
        trainingExercise.training = savedTraining;
        trainingExercise.exercise = te.exercise;
        trainingExercise.sets = te.sets;
        trainingExercise.reps = te.reps;
        return trainingExercise;
      });

      await this._dbService.dataSource
        .getRepository(TrainingExercise)
        .save(exercises);

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
          trainingExercises: {
            exercise: true,
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

      // Удаляем упражнения, которых больше нет в обновленной версии
      const exercisesToDelete = currentTraining.trainingExercises.filter(
        (currentTE) =>
          !updatedItem.trainingExercises.some(
            (updatedTE) => updatedTE.id === currentTE.id
          )
      );

      if (exercisesToDelete.length > 0) {
        await trainingExerciseRepo.remove(exercisesToDelete);
      }

      // Обновляем существующие и создаем новые упражнения
      for (const updatedTE of updatedItem.trainingExercises) {
        if (updatedTE.id) {
          // Обновляем существующее упражнение
          await trainingExerciseRepo.update(
            { id: updatedTE.id },
            {
              exercise: updatedTE.exercise,
              sets: updatedTE.sets,
              reps: updatedTE.reps,
            }
          );
        } else {
          // Создаем новое упражнение
          const newTE = trainingExerciseRepo.create({
            training: currentTraining,
            exercise: updatedTE.exercise,
            sets: updatedTE.sets,
            reps: updatedTE.reps,
          });
          await trainingExerciseRepo.save(newTE);
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
