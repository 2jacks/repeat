import { Component, OnInit, signal } from '@angular/core';
import { CurrentRegistryService } from '../../../current/services/current-registry.service';
import { Current } from '../../../current/entities/current.entity';
import { TrainingProgramRegistryService } from '../../../training-program/services/training-program-registry.service';
import { TrainingProgram } from '../../../training-program/entities/training-program.entity';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiMarkerHandler } from '@taiga-ui/core';
import { Training } from '../../../training/entities/training.entity';
import { TrainingRegistryService } from '../../../training/services/training-registry.service';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { CompletedTraining } from '../../../training/entities/completed-training.entity';
import { CompletedTrainingRegistryService } from '../../../training/services/completed-training-registry.service';
import { CompletedExercise } from '../../../training/entities/completed-exercise.entity';
import { CompletedExerciseSet } from '../../../exercises/entities/completed-exercise-set.entity';

const GREEN_DOT: [string] = ['var(--tui-status-positive)'];
const BLUE_DOT: [string] = ['var(--tui-status-info)'];
const RED_DOT: [string] = ['var(--tui-status-negative)'];
const YELLOW_DOT: [string] = ['var(--tui-status-warning)'];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-route.component.html',
  styleUrls: ['./home-route.component.scss'],
  standalone: false,
})
export class HomeRouteComponent implements OnInit {
  currentState: Current | null = null;
  trainingPrograms: TrainingProgram[] = [];
  completedTrainings: CompletedTraining[] = [];

  trainingProgramToStart: TrainingProgram | null = null;

  todayTraining = signal<Training | null>(null);
  isTodayTrainingNameFieldHidden: boolean = true;
  todayTrainingModalTitle: string = 'Тренировка';

  trainingTemplate = signal<Training | undefined>(undefined);
  todayTrainingDate = signal<Date | null>(null);

  isLoading = signal<boolean>(true);

  isStartTrainingModalOpen = false;
  isTodayTrainingModalOpen = false;

  constructor(
    public currentRegistry: CurrentRegistryService,
    private trainingProgramRegistry: TrainingProgramRegistryService,
    private trainingRegistry: TrainingRegistryService,
    private dialogs: TuiDialogService,
    private completedRegistry: CompletedTrainingRegistryService
  ) {}

  async ngOnInit() {
    await this.loadCurrentState();
    await this.loadTrainingPrograms();
    await this.getTodayTraining();
    await this.loadCompletedTrainings();

    this.isLoading.set(false);
  }

  private async loadCurrentState() {
    this.currentState = await this.currentRegistry.getCurrent();
  }

  private async loadTrainingPrograms() {
    this.trainingPrograms = await this.trainingProgramRegistry.getAll();
  }

  private async loadCompletedTrainings(): Promise<void> {
    this.completedTrainings = await this.completedRegistry.getAll();
  }

  public async getTodayTraining(): Promise<void> {
    if (
      !this.currentState?.activeTrainingProgram ||
      !this.currentState.trainingProgramStart
    ) {
      return;
    }

    const today = new Date();
    const startDate = new Date(this.currentState.trainingProgramStart);
    const endDate = new Date(
      this.currentRegistry.getTrainingProgramEndDate(
        this.currentState.trainingProgramStart,
        this.currentState.activeTrainingProgram.durationWeeks
      ) || 0
    );

    // Проверяем, что сегодняшний день находится в диапазоне программы
    if (today < startDate || today > endDate) {
      return;
    }

    // Получаем день недели (0 - воскресенье, 1 - понедельник, и т.д.)
    const dayOfWeek = today.getDay();
    // Преобразуем в формат, используемый в нашем приложении (1 - понедельник, 7 - воскресенье)
    const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Находим запись о тренировке на сегодняшний день
    const todayTrainingProgram =
      this.currentState.activeTrainingProgram.trainings.find(
        (training) => training.dayOfWeek === adjustedDayOfWeek
      );

    if (!todayTrainingProgram) {
      return;
    }

    // Получаем полные данные о тренировке из TrainingRegistry
    const todayTraining = await this.trainingRegistry.getById(
      todayTrainingProgram.training.id
    );
    this.todayTraining.set(todayTraining);
  }

  public stringifyTrainingProgram(program: TrainingProgram): string {
    return program.name;
  }

  async onStartTrainingProgramButtonClick() {
    if (this.trainingProgramToStart) {
      await this.currentRegistry.setActiveTrainingProgram(
        this.trainingProgramToStart
      );
      await this.loadCurrentState();
    }
  }

  public isTrainingDay: TuiMarkerHandler = (day: TuiDay) => {
    if (
      !this.currentState?.activeTrainingProgram ||
      !this.currentState.trainingProgramStart
    ) {
      return [];
    }

    const startDate = new Date(this.currentState.trainingProgramStart);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(
      this.currentRegistry.getTrainingProgramEndDate(
        this.currentState.trainingProgramStart,
        this.currentState.activeTrainingProgram.durationWeeks
      ) || 0
    );
    endDate.setHours(23, 59, 59, 999);

    const currentDate = new Date(day.toLocalNativeDate());
    currentDate.setHours(0, 0, 0, 0);

    // Проверяем, что дата находится в диапазоне программы
    if (currentDate < startDate || currentDate > endDate) {
      return [];
    }

    // Получаем день недели (0 - воскресенье, 1 - понедельник, и т.д.)
    const dayOfWeek = currentDate.getDay();
    // Преобразуем в формат, используемый в нашем приложении (1 - понедельник, 7 - воскресенье)
    const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Проверяем, есть ли тренировка в этот день недели
    const hasTraining = this.currentState.activeTrainingProgram.trainings.some(
      (training) => training.dayOfWeek === adjustedDayOfWeek
    );

    // Проверяем, есть ли завершенная тренировка в этот день
    const hasCompletedTraining = this.completedTrainings.some((training) => {
      const trainingDate = new Date(training.date);
      trainingDate.setHours(0, 0, 0, 0);
      return trainingDate.getTime() === currentDate.getTime();
    });

    // Если есть завершенная тренировка, но она не по плану
    if (hasCompletedTraining && !hasTraining) {
      return BLUE_DOT; // Неплановая тренировка
    }

    // Если нет тренировки по плану
    if (!hasTraining) {
      return [];
    }

    if (hasCompletedTraining) {
      return GREEN_DOT; // Тренировка выполнена
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (currentDate > today) {
      return YELLOW_DOT; // Тренировка запланирована
    } else {
      return RED_DOT; // Тренировка пропущена
    }
  };

  showStartTrainingModal() {
    this.isStartTrainingModalOpen = true;
  }

  openTodayTrainingModal(training?: Training) {
    this.isStartTrainingModalOpen = false;
    this.isTodayTrainingModalOpen = true;
    this.trainingTemplate.set(training);
    this.todayTrainingDate.set(new Date());
    this.todayTrainingModalTitle =
      this.trainingTemplate()?.name || 'Тренировка';
  }

  closeStartTrainingModal() {
    this.isStartTrainingModalOpen = false;
  }

  closeTodayTrainingModal() {
    this.isTodayTrainingModalOpen = false;
  }

  async onCompletedTrainingSubmit(training: Training) {
    try {
      // Создаем сущность CompletedTraining
      const completedTraining = new CompletedTraining();
      completedTraining.templateTraining = this.trainingTemplate()!;
      completedTraining.date = this.todayTrainingDate()!.getTime() as any;
      completedTraining.exercises = [];

      // Преобразуем упражнения тренировки в завершенные упражнения
      for (const exercise of training.exercises) {
        const completedExercise = new CompletedExercise();
        completedExercise.exercise = exercise.exercise;
        completedExercise.sets = [];

        // Преобразуем подходы упражнения в завершенные подходы
        for (const set of exercise.sets) {
          const completedExerciseSet = new CompletedExerciseSet();
          completedExerciseSet.set = set.set;
          completedExercise.sets.push(completedExerciseSet);
        }

        completedTraining.exercises.push(completedExercise);
      }

      // Сохраняем завершенную тренировку
      await this.completedRegistry.create(completedTraining);

      // Очищаем поля после успешного сохранения
      this.trainingTemplate.set(undefined);
      this.todayTrainingDate.set(null);
      this.closeTodayTrainingModal();
    } catch (error) {
      console.error('Ошибка при сохранении завершенной тренировки:', error);
    }
  }
}
