import { Injectable } from '@angular/core';
import { CompletedExercisesRegistryService } from '../../exercises/services/completed-exercises-registry.service';
import { CurrentRegistryService } from '../../current/services/current-registry.service';
import { Types } from '../../shared/utils/utils';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { TrainingExercise } from '../../training/entities/training-exercise.entity';
import { TrainingExerciseSet } from '../../exercises/entities/training-exercise-set.entity';
import { CompletedTrainingRegistryService } from '../../training/services/completed-training-registry.service';
import { ExercisesRegistryService } from '../../exercises/services/exercises-registry.service';

@Injectable()
export class StatisticsService {
  constructor(
    private completedExercisesRegistry: CompletedExercisesRegistryService,
    private currentRegistry: CurrentRegistryService,
    private completedTrainingRegistry: CompletedTrainingRegistryService,
    private exerciseRegistry: ExercisesRegistryService
  ) {}

  /**
   * Возвращает общее количество выполненных подходов для конкретного упражнения
   * в рамках текущей активной программы тренировок.
   *
   * @param exercise - Упражнение, для которого считается статистика
   * @returns Общее количество выполненных подходов
   */
  public async getTotalCompletedSets(
    exercise: Exercise
  ): Types.ServiceResult<number> {
    try {
      const completedExercises =
        await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
          exercise.id
        );

      // Получаем текущую программу напрямую из репозитория
      const current = await this.currentRegistry.repository.findOne({
        where: { id: 1 },
      });

      if (!current || !current.trainingProgramStart) {
        return 0;
      }

      // Фильтруем только те упражнения, которые выполнены в рамках текущей программы
      const exercisesInCurrentProgram = completedExercises.filter(
        (completed) =>
          new Date(completed.completedTraining.date).getTime() >=
          current.trainingProgramStart
      );

      // Считаем общее количество подходов
      return exercisesInCurrentProgram.reduce(
        (total, completed) => total + completed.sets.length,
        0
      );
    } catch (err) {
      throw new Error('Failed to calculate total completed sets');
    }
  }

  /**
   * Рассчитывает процент выполнения нагрузки по весам для конкретного упражнения.
   * Сравнивает общий вес, который должен был быть поднят согласно плану тренировок,
   * с фактически поднятым весом. Возвращает процент выполнения в диапазоне от 0 до 100.
   *
   * @param exercise - Упражнение, для которого рассчитывается статистика
   * @returns Процент выполнения нагрузки по весам
   */
  public async getWeightLoadCompletion(
    exercise: Exercise
  ): Types.ServiceResult<number> {
    try {
      const scheduledTrainings =
        await this.currentRegistry.getScheduledTrainings();
      const completedExercises =
        await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
          exercise.id
        );

      if (scheduledTrainings.length === 0 || completedExercises.length === 0) {
        return 0;
      }

      let totalScheduledWeight = 0;
      let totalCompletedWeight = 0;
      const currentDate = new Date().getTime();

      const scheduledTrainingsWithExercise = scheduledTrainings.filter(
        (training) =>
          training.training.exercises.some(
            (_exercise) => _exercise.exercise.id === exercise.id
          )
      );

      // Считаем запланированный вес только для тренировок до текущей даты
      for (const scheduled of scheduledTrainingsWithExercise) {
        if (scheduled.date < currentDate) {
          const exerciseInTraining = scheduled.training.exercises.find(
            (e: TrainingExercise) => e.exercise.id === exercise.id
          );
          if (exerciseInTraining) {
            for (const set of exerciseInTraining.sets) {
              totalScheduledWeight += set.set.weight * set.set.reps;
            }
          }
        }
      }

      // Считаем выполненный вес
      for (const completed of completedExercises) {
        for (const set of completed.sets) {
          totalCompletedWeight += set.set.weight * set.set.reps;
        }
      }

      return totalScheduledWeight > 0
        ? parseInt(`${(totalCompletedWeight / totalScheduledWeight) * 100}`)
        : 0;
    } catch (err) {
      throw new Error('Failed to calculate weight load completion');
    }
  }

  /**
   * Рассчитывает процент выполнения нагрузки по подходам для конкретного упражнения.
   * Сравнивает количество запланированных подходов с фактически выполненными.
   * Возвращает процент выполнения в диапазоне от 0 до 100.
   *
   * @param exercise - Упражнение, для которого рассчитывается статистика
   * @returns Процент выполнения нагрузки по подходам
   */
  public async getRepsLoadCompletion(
    exercise: Exercise
  ): Types.ServiceResult<number> {
    try {
      const scheduledTrainings =
        await this.currentRegistry.getScheduledTrainings();
      const completedExercises =
        await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
          exercise.id
        );

      if (scheduledTrainings.length === 0 || completedExercises.length === 0) {
        return 0;
      }

      let totalScheduledReps = 0;
      let totalCompletedReps = 0;
      const currentDate = new Date().getTime();

      const scheduledTrainingsWithExerciseByDate = scheduledTrainings
        .filter((training) => training.date < currentDate)
        .filter((training) =>
          training.training.exercises.some(
            (_exercise) => _exercise.exercise.id === exercise.id
          )
        )
        .sort((a, b) => a.date - b.date);

      // Считаем запланированные повторы только для тренировок до текущей даты
      for (const scheduled of scheduledTrainingsWithExerciseByDate) {
        const exerciseInTraining = scheduled.training.exercises.find(
          (e: TrainingExercise) => e.exercise.id === exercise.id
        );

        exerciseInTraining!.sets.forEach((set) => {
          totalScheduledReps += set.set.reps;
        });
      }

      // Считаем выполненные подходы
      for (const completed of completedExercises) {
        completed.sets.forEach((set) => {
          totalCompletedReps += set.set.reps;
        });
      }

      return totalScheduledReps > 0
        ? parseInt(`${(totalCompletedReps / totalScheduledReps) * 100}`)
        : 0;
    } catch (err) {
      throw new Error('Failed to calculate sets load completion');
    }
  }

  /**
   * Возвращает историю прогрессии весов для конкретного упражнения.
   * Для каждой тренировки, где выполнялось упражнение, возвращается дата
   * и максимальный вес, который был поднят в любом из подходов.
   * Данные сортируются по дате в порядке возрастания.
   *
   * @param exercise - Упражнение, для которого рассчитывается прогрессия
   * @returns Массив объектов с датой и максимальным весом
   */
  public async getWeightProgression(
    exercise: Exercise
  ): Types.ServiceResult<{ date: number; weight: number }[]> {
    try {
      const completedExercises =
        await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
          exercise.id
        );
      const progression: { date: number; weight: number }[] = [];

      completedExercises.forEach((completed) => {
        let maxWeight = 0;
        completed.sets.forEach((set) => {
          if (set.set.weight > maxWeight) {
            maxWeight = set.set.weight;
          }
        });

        if (maxWeight > 0) {
          progression.push({
            date: new Date(completed.completedTraining.date).getTime(),
            weight: maxWeight,
          });
        }
      });

      return progression.sort((a, b) => a.date - b.date);
    } catch (err) {
      throw new Error('Failed to calculate weight progression');
    }
  }

  /**
   * Возвращает историю прогрессии повторений для конкретного упражнения.
   * Для каждой тренировки, где выполнялось упражнение, возвращается дата
   * и общее количество повторений, выполненных во всех подходах.
   * Данные сортируются по дате в порядке возрастания.
   *
   * @param exercise - Упражнение, для которого рассчитывается прогрессия
   * @returns Массив объектов с датой и общим количеством повторений
   */
  public async getRepsProgression(
    exercise: Exercise
  ): Types.ServiceResult<{ date: number; reps: number }[]> {
    try {
      const completedExercises =
        await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
          exercise.id
        );
      const progression: { date: number; reps: number }[] = [];

      completedExercises.forEach((completed) => {
        let totalReps = 0;
        completed.sets.forEach((set) => {
          totalReps += set.set.reps;
        });

        if (totalReps > 0) {
          progression.push({
            date: new Date(completed.completedTraining.date).getTime(),
            reps: totalReps,
          });
        }
      });

      return progression.sort((a, b) => a.date - b.date);
    } catch (err) {
      throw new Error('Failed to calculate reps progression');
    }
  }

  /**
   * Рассчитывает количество пропущенных тренировок в рамках текущего активного плана
   * от начала программы до текущего момента
   *
   * @returns Количество пропущенных тренировок
   */
  public async getMissedTrainingsCount(): Types.ServiceResult<number> {
    try {
      const current = await this.currentRegistry.repository.findOne({
        where: { id: 1 },
      });

      if (!current || !current.trainingProgramStart) {
        return 0;
      }

      const scheduledTrainings =
        await this.currentRegistry.getScheduledTrainings();
      const currentDate = new Date().getTime();

      // Фильтруем запланированные тренировки до текущей даты
      const pastScheduledTrainings = scheduledTrainings.filter(
        (training) => training.date < currentDate
      );

      // Получаем все выполненные тренировки
      const completedTrainings = await this.completedTrainingRegistry.getAll();

      // Создаем Map для быстрого поиска выполненных тренировок по дате и шаблону
      const completedTrainingsMap = new Map<string, boolean>();
      completedTrainings.forEach((training) => {
        const key = `${training.date}_${training.templateTraining?.id}`;
        completedTrainingsMap.set(key, true);
      });

      // Считаем пропущенные тренировки
      return pastScheduledTrainings.filter((scheduled) => {
        const key = `${scheduled.date}_${scheduled.training.id}`;
        return !completedTrainingsMap.has(key);
      }).length;
    } catch (err) {
      throw new Error('Failed to calculate missed trainings count');
    }
  }

  /**
   * Рассчитывает количество проведенных тренировок за последний месяц
   *
   * @returns Количество тренировок за последний месяц
   */
  public async getTrainingsCountLastMonth(): Types.ServiceResult<number> {
    try {
      const completedTrainings = await this.completedTrainingRegistry.getAll();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      return completedTrainings.filter(
        (training) => new Date(training.date).getTime() >= oneMonthAgo.getTime()
      ).length;
    } catch (err) {
      throw new Error('Failed to calculate trainings count for last month');
    }
  }

  /**
   * Находит упражнение с наибольшей прогрессией в рабочих весах
   * в рамках текущей тренировочной программы
   *
   * @returns Объект с упражнением и процентом прогрессии
   */
  public async getExerciseWithMaxProgression(): Types.ServiceResult<{
    exercise: Exercise;
    progression: number;
  } | null> {
    try {
      const current = await this.currentRegistry.repository.findOne({
        where: { id: 1 },
      });

      if (!current || !current.trainingProgramStart) {
        return null;
      }

      // Получаем все упражнения из текущей программы
      const scheduledTrainings =
        await this.currentRegistry.getScheduledTrainings();
      const exercisesInProgram = new Set<Exercise>();

      scheduledTrainings.forEach((training) => {
        training.training.exercises.forEach((exercise) => {
          exercisesInProgram.add(exercise.exercise);
        });
      });

      let maxProgression = 0;
      let exerciseWithMaxProgression: Exercise | null = null;

      // Для каждого упражнения считаем прогрессию
      for (const exercise of exercisesInProgram) {
        const completedExercises =
          await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
            exercise.id
          );

        if (completedExercises.length < 2) continue;

        // Сортируем по дате
        const sortedExercises = completedExercises.sort(
          (a, b) =>
            new Date(a.completedTraining.date).getTime() -
            new Date(b.completedTraining.date).getTime()
        );

        // Находим первый и последний вес
        const firstWeight = Math.max(
          ...sortedExercises[0].sets.map((set) => set.set.weight)
        );
        const lastWeight = Math.max(
          ...sortedExercises[sortedExercises.length - 1].sets.map(
            (set) => set.set.weight
          )
        );

        // Считаем прогрессию в процентах
        const progression =
          firstWeight > 0
            ? ((lastWeight - firstWeight) / firstWeight) * 100
            : 0;

        if (progression > maxProgression) {
          maxProgression = progression;
          exerciseWithMaxProgression = exercise;
        }
      }

      return exerciseWithMaxProgression
        ? {
            exercise: exerciseWithMaxProgression,
            progression: parseInt(`${maxProgression}`),
          }
        : null;
    } catch (err) {
      throw new Error('Failed to find exercise with max progression');
    }
  }

  /**
   * Находит упражнение с самым большим рабочим весом за все время
   *
   * @returns Объект с упражнением и максимальным весом
   */
  public async getExerciseWithMaxWeight(): Types.ServiceResult<{
    exercise: Exercise;
    maxWeight: number;
  } | null> {
    try {
      // Получаем все упражнения из базы
      const allExercises = await this.exerciseRegistry.getAll();

      let maxWeight = 0;
      let exerciseWithMaxWeight: Exercise | null = null;

      // Для каждого упражнения ищем максимальный вес
      for (const exercise of allExercises) {
        const completedExercises =
          await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
            exercise.id
          );

        if (completedExercises.length === 0) continue;

        // Находим максимальный вес среди всех подходов
        const currentMaxWeight = Math.max(
          ...completedExercises.flatMap((completed) =>
            completed.sets.map((set) => set.set.weight)
          )
        );

        if (currentMaxWeight > maxWeight) {
          maxWeight = currentMaxWeight;
          exerciseWithMaxWeight = exercise;
        }
      }

      return exerciseWithMaxWeight
        ? { exercise: exerciseWithMaxWeight, maxWeight }
        : null;
    } catch (err) {
      throw new Error('Failed to find exercise with max weight');
    }
  }

  /**
   * Находит самое популярное упражнение на основе количества выполненных подходов
   *
   * @returns Объект с упражнением и общим количеством подходов
   */
  public async getMostPopularExercise(): Types.ServiceResult<{
    exercise: Exercise;
    totalSets: number;
  } | null> {
    try {
      // Получаем все упражнения из базы
      const allExercises = await this.exerciseRegistry.getAll();

      let maxSets = 0;
      let mostPopularExercise: Exercise | null = null;

      // Для каждого упражнения считаем общее количество подходов
      for (const exercise of allExercises) {
        const completedExercises =
          await this.completedExercisesRegistry.getCompletedExercisesByExerciseId(
            exercise.id
          );

        if (completedExercises.length === 0) continue;

        // Считаем общее количество подходов
        const totalSets = completedExercises.reduce(
          (sum, completed) => sum + completed.sets.length,
          0
        );

        if (totalSets > maxSets) {
          maxSets = totalSets;
          mostPopularExercise = exercise;
        }
      }

      return mostPopularExercise
        ? { exercise: mostPopularExercise, totalSets: maxSets }
        : null;
    } catch (err) {
      throw new Error('Failed to find most popular exercise');
    }
  }
}
