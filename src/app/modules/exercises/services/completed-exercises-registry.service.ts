import { Injectable } from '@angular/core';
import { BaseRegistryService } from '../../shared/services/base-registry-service.service';
import { DatabaseService } from '../../../services/database.service';
import { Environment } from 'src/app/environment';
import { Repository } from 'typeorm';
import { CompletedExercise } from '../../training/entities/completed-exercise.entity';
import { Types } from '../../shared/utils/utils';
import { Exercise } from '../entities/exercise.entity';

@Injectable()
export class CompletedExercisesRegistryService extends BaseRegistryService {
  repository: Repository<CompletedExercise>;

  constructor(
    private dbService: DatabaseService,
    protected override _env: Environment
  ) {
    super(dbService, _env);
    this.repository = this.dataSource.getRepository(CompletedExercise);
  }

  public async getAllCompletedExercises(): Types.ServiceResult<
    CompletedExercise[]
  > {
    try {
      const res = await this.repository.find({
        relations: {
          exercise: true,
          completedTraining: true,
          sets: {
            set: true,
          },
        },
        order: {
          completedTraining: {
            date: 'DESC',
          },
        },
      });

      return res;
    } catch (err) {
      throw new Error('Failed to get completed exercises');
    }
  }

  public async getCompletedExercisesByExerciseId(
    exerciseId: number
  ): Types.ServiceResult<CompletedExercise[]> {
    try {
      const res = await this.repository.find({
        where: {
          exercise: { id: exerciseId },
        },
        relations: {
          exercise: true,
          completedTraining: true,
          sets: {
            set: true,
          },
        },
        order: {
          completedTraining: {
            date: 'DESC',
          },
        },
      });

      return res;
    } catch (err) {
      throw new Error('Failed to get completed exercises by exercise id');
    }
  }

  public async getExerciseStatistics(exerciseId: number): Types.ServiceResult<{
    totalSets: number;
    maxWeight: number;
    averageWeight: number;
    totalVolume: number;
    lastCompletedDate: Date | null;
  }> {
    try {
      const completedExercises = await this.getCompletedExercisesByExerciseId(
        exerciseId
      );

      if (completedExercises.length === 0) {
        return {
          totalSets: 0,
          maxWeight: 0,
          averageWeight: 0,
          totalVolume: 0,
          lastCompletedDate: null,
        };
      }

      let totalSets = 0;
      let maxWeight = 0;
      let totalWeight = 0;
      let totalVolume = 0;
      let lastCompletedDate: Date | null = null;

      completedExercises.forEach((completedExercise) => {
        completedExercise.sets.forEach((set) => {
          totalSets++;
          const weight = set.set.weight;
          const reps = set.set.reps;

          if (weight > maxWeight) {
            maxWeight = weight;
          }

          totalWeight += weight;
          totalVolume += weight * reps;
        });

        const exerciseDate = new Date(completedExercise.completedTraining.date);
        if (!lastCompletedDate || exerciseDate > lastCompletedDate) {
          lastCompletedDate = exerciseDate;
        }
      });

      return {
        totalSets,
        maxWeight,
        averageWeight: totalWeight / totalSets,
        totalVolume,
        lastCompletedDate,
      };
    } catch (err) {
      throw new Error('Failed to get exercise statistics');
    }
  }

  public async getAllExercisesStatistics(): Types.ServiceResult<
    {
      exercise: Exercise;
      totalSets: number;
      maxWeight: number;
      averageWeight: number;
      totalVolume: number;
      lastCompletedDate: Date | null;
    }[]
  > {
    try {
      const completedExercises = await this.getAllCompletedExercises();
      const exerciseMap = new Map<
        number,
        {
          exercise: Exercise;
          totalSets: number;
          maxWeight: number;
          totalWeight: number;
          totalVolume: number;
          lastCompletedDate: Date | null;
        }
      >();

      completedExercises.forEach((completedExercise) => {
        const exerciseId = completedExercise.exercise.id;
        const exerciseData = exerciseMap.get(exerciseId) || {
          exercise: completedExercise.exercise,
          totalSets: 0,
          maxWeight: 0,
          totalWeight: 0,
          totalVolume: 0,
          lastCompletedDate: null,
        };

        completedExercise.sets.forEach((set) => {
          exerciseData.totalSets++;
          const weight = set.set.weight;
          const reps = set.set.reps;

          if (weight > exerciseData.maxWeight) {
            exerciseData.maxWeight = weight;
          }

          exerciseData.totalWeight += weight;
          exerciseData.totalVolume += weight * reps;
        });

        const exerciseDate = new Date(completedExercise.completedTraining.date);
        if (
          !exerciseData.lastCompletedDate ||
          exerciseDate > exerciseData.lastCompletedDate
        ) {
          exerciseData.lastCompletedDate = exerciseDate;
        }

        exerciseMap.set(exerciseId, exerciseData);
      });

      return Array.from(exerciseMap.values()).map((data) => ({
        ...data,
        averageWeight:
          data.totalSets > 0 ? data.totalWeight / data.totalSets : 0,
      }));
    } catch (err) {
      throw new Error('Failed to get all exercises statistics');
    }
  }
}
