import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingProgram } from '../../entities/training-program.entity';
import { TrainingRegistryService } from '../../../training/services/training-registry.service';
import { TrainingProgramRegistryService } from '../../services/training-program-registry.service';
import { Training } from '../../../training/entities/training.entity';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-edit-training-program-form',
  templateUrl: './create-edit-training-program-form.component.html',
  styleUrls: ['./create-edit-training-program-form.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditTrainingProgramFormComponent implements OnInit {
  @Output() afterSubmit = new EventEmitter<void>();
  @Output() afterCancel = new EventEmitter<void>();

  form: FormGroup;
  trainings: Training[] = [];
  isEditMode = false;
  programId?: number;

  readonly goalItems = ['Набор массы', 'Похудение', 'Сила', 'Выносливость'];

  readonly weekDays = [
    { name: 'Понедельник', value: 1 },
    { name: 'Вторник', value: 2 },
    { name: 'Среда', value: 3 },
    { name: 'Четверг', value: 4 },
    { name: 'Пятница', value: 5 },
    { name: 'Суббота', value: 6 },
    { name: 'Воскресенье', value: 7 },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trainingRegistry: TrainingRegistryService,
    private trainingProgramRegistry: TrainingProgramRegistryService,
    private _location: Location
  ) {
    // Инициализируем форму при создании компонента
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      durationWeeks: [4, [Validators.required, Validators.min(1)]],
      goal: [this.goalItems[0], [Validators.required]],
      isActive: [false],
      trainings: this.fb.array([]),
    });

    // Добавляем пустую тренировку по умолчанию
    this.addTraining();
  }

  async ngOnInit() {
    await this.loadTrainings();

    // Получаем id из URL если есть
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.programId = +id;
      await this.loadProgram(this.programId);
    }
  }

  private async loadTrainings() {
    this.trainings = await this.trainingRegistry.getAll();
  }

  private async loadProgram(id: number) {
    const program = await this.trainingProgramRegistry.getById(id);
    if (program) {
      this.updateFormWithProgram(program);
    } else {
      // Если программа не найдена, перенаправляем на список
      this.router.navigate(['/training-program']);
    }
  }

  private updateFormWithProgram(program: TrainingProgram) {
    // Очищаем массив тренировок
    while (this.trainingsFormArray.length) {
      this.trainingsFormArray.removeAt(0);
    }

    // Обновляем значения формы
    this.form.patchValue({
      name: program.name,
      description: program.description,
      durationWeeks: program.durationWeeks,
      goal: program.goal,
    });

    // Добавляем тренировки
    if (program.trainings?.length) {
      program.trainings.forEach((training) => {
        this.addTraining(training.training, training.dayOfWeek);
      });
    } else {
      // Если тренировок нет, добавляем одну пустую
      this.addTraining();
    }
  }

  get trainingsFormArray() {
    return this.form.get('trainings') as FormArray;
  }

  addTraining(training?: Training, dayOfWeek?: number) {
    const trainingGroup = this.fb.group({
      training: [training, [Validators.required]],
      dayOfWeek: [
        this.weekDays.find((wd) => wd.value === dayOfWeek) ?? 1,
        [Validators.required, Validators.min(1), Validators.max(7)],
      ],
    });

    this.trainingsFormArray.push(trainingGroup);
  }

  removeTraining(index: number) {
    this.trainingsFormArray.removeAt(index);
  }

  public stringifyGoal(goal: string) {
    return goal;
  }

  public stringifyTraining(training: Training) {
    return training.name;
  }

  public stringifyWeekDay(weekDay: any) {
    return weekDay.name;
  }

  async onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const programData: TrainingProgram = {
        ...(this.isEditMode && this.programId ? { id: this.programId } : {}),
        ...formValue,
        trainings: formValue.trainings.map((t: any) => ({
          training: this.trainings.find((tr) => tr.id === t.training.id)!,
          dayOfWeek: t.dayOfWeek.value,
        })),
      };

      try {
        if (this.isEditMode) {
          await this.trainingProgramRegistry.update(programData);
          this._location.back();
        } else {
          await this.trainingProgramRegistry.create(programData);
        }

        this.afterSubmit.emit();
      } catch (error) {
        console.error('Failed to save training program:', error);
        // Здесь можно добавить обработку ошибок, например, показ уведомления
      }
    }
  }

  onCancel() {
    if (this.isEditMode) {
      this._location.back();
    } else {
      this.form.reset();
    }
    this.afterCancel.emit();
  }
}
