import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Environment } from 'src/app/environment';
import { Repository } from 'typeorm';
import { Types } from '../../shared/utils/utils';
import { TrainingProgram } from '../entities/training-program.entity';
import { TrainingProgramTraining } from '../entities/training-program-training.entity';

@Injectable()
export class TrainingProgramRegistryService extends BaseRegistryService {
  repository: Repository<TrainingProgram>;
  public items: WritableSignal<TrainingProgram[]> = signal([]);

  constructor(
    private dbService: DatabaseService,
    protected override _env: Environment
  ) {
    super(dbService, _env);
    this.repository = this.dataSource.getRepository(TrainingProgram);
  }

  public async getAll(): Types.ServiceResult<TrainingProgram[]> {
    try {
      const res = await this.repository.find({
        relations: {
          trainings: {
            training: true,
          },
        },
        order: {
          trainings: {
            dayOfWeek: 'ASC',
          },
        },
      });

      this.items.set(res);
      return res;
    } catch (err) {
      throw new Error('Failed to get training programs');
    }
  }

  public async getById(
    id: number
  ): Types.ServiceResult<TrainingProgram | null> {
    try {
      const res = await this.repository.findOne({
        where: { id },
        relations: {
          trainings: {
            training: true,
          },
        },
      });
      return res;
    } catch (err) {
      throw new Error('Failed to get training program by id');
    }
  }

  public async create(
    newItem: TrainingProgram
  ): Types.ServiceResult<TrainingProgram> {
    try {
      // Создаем программу без тренировок
      const program = this.repository.create({
        name: newItem.name,
        description: newItem.description,
        durationWeeks: newItem.durationWeeks,
        goal: newItem.goal,
      });
      const savedProgram = await this.repository.save(program);

      // Создаем записи в промежуточной таблице
      if (newItem.trainings && newItem.trainings.length > 0) {
        const trainingProgramTrainingRepo =
          this._dbService.dataSource.getRepository(TrainingProgramTraining);
        const trainings = newItem.trainings.map((tpt) => {
          const trainingProgramTraining = new TrainingProgramTraining();
          trainingProgramTraining.program = savedProgram;
          trainingProgramTraining.training = tpt.training;
          trainingProgramTraining.dayOfWeek = tpt.dayOfWeek;
          return trainingProgramTraining;
        });

        await trainingProgramTrainingRepo.save(trainings);
      }

      await this._saveDataIfWeb();
      await this.getAll();

      return savedProgram;
    } catch (err) {
      throw new Error('Failed to create training program');
    }
  }

  public async update(updatedItem: TrainingProgram): Types.ServiceResult<void> {
    try {
      // Получаем текущую версию программы из БД со всеми связями
      const currentProgram = await this.repository.findOne({
        where: { id: updatedItem.id },
        relations: {
          trainings: {
            training: true,
          },
        },
      });

      if (!currentProgram) {
        throw new Error('Training program not found');
      }

      // Обновляем основные данные программы
      currentProgram.name = updatedItem.name;
      currentProgram.description = updatedItem.description;
      currentProgram.durationWeeks = updatedItem.durationWeeks;
      currentProgram.goal = updatedItem.goal;
      await this.repository.save(currentProgram);

      const trainingProgramTrainingRepo =
        this._dbService.dataSource.getRepository(TrainingProgramTraining);

      // Удаляем тренировки, которых больше нет в обновленной версии
      const trainingsToDelete = currentProgram.trainings.filter(
        (currentTPT) =>
          !updatedItem.trainings.some(
            (updatedTPT) => updatedTPT.id === currentTPT.id
          )
      );

      if (trainingsToDelete.length > 0) {
        await trainingProgramTrainingRepo.remove(trainingsToDelete);
      }

      // Обновляем существующие и создаем новые тренировки
      for (const updatedTPT of updatedItem.trainings) {
        if (updatedTPT.id) {
          // Обновляем существующую тренировку
          await trainingProgramTrainingRepo.update(
            { id: updatedTPT.id },
            {
              training: updatedTPT.training,
              dayOfWeek: updatedTPT.dayOfWeek,
            }
          );
        } else {
          // Создаем новую тренировку
          const newTPT = trainingProgramTrainingRepo.create({
            program: currentProgram,
            training: updatedTPT.training,
            dayOfWeek: updatedTPT.dayOfWeek,
          });
          await trainingProgramTrainingRepo.save(newTPT);
        }
      }

      await this._saveDataIfWeb();
    } catch (err) {
      throw new Error('Failed to update training program');
    } finally {
      await this.getAll();
    }
  }

  public async delete(item: TrainingProgram): Types.ServiceResult<void> {
    try {
      await this.repository.remove(item);
      await this._saveDataIfWeb();
    } catch (err) {
      throw new Error('Failed to delete training program');
    } finally {
      await this.getAll();
    }
  }
}
