import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Training } from '../../entities/training.entity';
import { Exercise } from '../../../exercises/entities/exercise.entity';
import { Set } from '../../../exercises/entities/set.entity';
import { TrainingExercise } from '../../entities/training-exercise.entity';
import { ExercisesRegistryService } from '../../../exercises/services/exercises-registry.service';
import { TrainingExerciseSet } from 'src/app/modules/exercises/entities/training-exercise-set.entity';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss'],
  standalone: false,
})
export class TrainingFormComponent implements OnInit {
  @Input() training?: Training;
  @Input() title: string = 'Тренировка';
  @Input() submitBtnText: string = 'Сохранить';
  @Input() cancelBtnText: string = 'Отмена';

  @Output() onSubmit = new EventEmitter<Training>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  exercisesList: Exercise[] = [];

  constructor(
    private fb: FormBuilder,
    private exercisesRegistryService: ExercisesRegistryService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      exercises: this.fb.array([]),
    });
  }

  async ngOnInit() {
    await this.loadExercises();
    if (this.training) {
      this.fillFormWithTraining();
    } else {
      this.addExercise();
    }
  }

  private async loadExercises() {
    try {
      this.exercisesList = await this.exercisesRegistryService.getAll();
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  }

  private fillFormWithTraining() {
    this.form.patchValue({
      name: this.training?.name,
    });

    const exercises = this.getExercises() as FormArray;
    exercises.clear();

    this.training?.exercises.forEach((te) => {
      const exerciseForm = this.fb.group({
        exercise: [te.exercise, Validators.required],
        sets: this.fb.array([]),
      });

      const sets = this.getSets(exerciseForm) as FormArray;
      te.sets.forEach((set) => {
        sets.push(
          this.fb.group({
            number: [set.set.number, Validators.required],
            reps: [set.set.reps, [Validators.required, Validators.min(1)]],
            weight: [set.set.weight, [Validators.required, Validators.min(0)]],
          })
        );
      });

      exercises.push(exerciseForm);
    });
  }

  getExercises() {
    return this.form.get('exercises') as FormArray;
  }

  addExercise() {
    const exerciseForm = this.fb.group({
      exercise: [null, Validators.required],
      sets: this.fb.array([]),
    });

    this.getExercises().push(exerciseForm);
    this.addSet(exerciseForm);
  }

  removeExercise(index: number) {
    if (this.getExercises().length > 1) {
      this.getExercises().removeAt(index);
    }
  }

  getSets(exerciseFormItem: FormGroup): FormArray {
    return exerciseFormItem.get('sets') as FormArray;
  }

  addSet(exerciseFormItem: FormGroup) {
    const setForm = this.fb.group({
      number: [this.getSets(exerciseFormItem).length + 1, Validators.required],
      reps: [1, [Validators.required, Validators.min(1)]],
      weight: [1, [Validators.required, Validators.min(0)]],
    });

    this.getSets(exerciseFormItem).push(setForm);
  }

  removeSet(exerciseFormItem: FormGroup, setIndex: number) {
    const sets = this.getSets(exerciseFormItem);
    if (sets.length > 1) {
      sets.removeAt(setIndex);
      // Обновляем номера подходов
      sets.controls.forEach((control, index) => {
        control.patchValue({ number: index + 1 });
      });
    }
  }

  async handleSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const training = new Training();
      training.name = formValue.name;

      training.exercises = formValue.exercises.map((te: any) => {
        const trainingExercise = new TrainingExercise();
        trainingExercise.exercise = te.exercise;
        trainingExercise.sets = te.sets.map((set: any) => {
          const newSet = new TrainingExerciseSet();
          newSet.set = set;
          return newSet;
        });
        return trainingExercise;
      });

      this.onSubmit.emit(training);
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }

  protected _stringifyExercise(exercise: Exercise) {
    return exercise.name;
  }
}
