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

const ONE_DOT: [string] = ['var(--tui-status-positive)'];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-route.component.html',
  styleUrls: ['./home-route.component.scss'],
  standalone: false,
})
export class HomeRouteComponent implements OnInit {
  currentState: Current | null = null;
  trainingPrograms: TrainingProgram[] = [];
  trainingProgramToStart: TrainingProgram | null = null;
  todayTraining = signal<Training | null>(null);
  isTodayTrainingNameFieldHidden: boolean = true;
  todayTrainingModalTitle: string = 'Тренировка';

  trainingTemplate = signal<Training | undefined>(undefined);

  isLoading = signal<boolean>(true);

  constructor(
    public currentRegistry: CurrentRegistryService,
    private trainingProgramRegistry: TrainingProgramRegistryService,
    private trainingRegistry: TrainingRegistryService,
    private dialogs: TuiDialogService
  ) {}

  async ngOnInit() {
    await this.loadCurrentState();
    await this.loadTrainingPrograms();
    await this.getTodayTraining();

    this.isLoading.set(false);
  }

  private async loadCurrentState() {
    this.currentState = await this.currentRegistry.getCurrent();
  }

  private async loadTrainingPrograms() {
    this.trainingPrograms = await this.trainingProgramRegistry.getAll();
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
    // Устанавливаем начало дня (00:00:00)
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(
      this.currentRegistry.getTrainingProgramEndDate(
        this.currentState.trainingProgramStart,
        this.currentState.activeTrainingProgram.durationWeeks
      ) || 0
    );
    // Устанавливаем конец дня (23:59:59.999)
    endDate.setHours(23, 59, 59, 999);

    const currentDate = new Date(day.toLocalNativeDate());
    // Устанавливаем полночь для корректного сравнения
    currentDate.setHours(0, 0, 0, 0);

    // Проверяем, что дата находится в диапазоне программы
    if (currentDate <= startDate || currentDate >= endDate) {
      return [];
    }

    // Получаем день недели (0 - воскресенье, 1 - понедельник, и т.д.)
    const dayOfWeek = currentDate.getDay();
    // Преобразуем в формат, используемый в нашем приложении (1 - понедельник, 7 - воскресенье)
    const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Проверяем, есть ли тренировка в этот день недели
    return this.currentState.activeTrainingProgram.trainings.some(
      (training) => training.dayOfWeek === adjustedDayOfWeek
    )
      ? ONE_DOT
      : [];
  };

  showStartTrainingModal(content: PolymorpheusContent<TuiDialogContext>) {
    this.dialogs
      .open(content, {
        closeable: false,
      })
      .subscribe();
  }

  openTodayTrainingModal(
    content: PolymorpheusContent<TuiDialogContext>,
    training?: Training
  ) {
    this.trainingTemplate.set(training);
    this.todayTrainingModalTitle =
      this.trainingTemplate()?.name || 'Тренировка';
    this.dialogs
      .open(content, {
        size: 'fullscreen',
      })
      .subscribe();
  }

  onCompletedTrainingSubmit(training: Training) {
    console.log(training);
    console.log(this.trainingTemplate());
  }
}
