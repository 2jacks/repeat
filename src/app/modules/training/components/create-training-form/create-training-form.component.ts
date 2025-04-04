import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingRegistryService } from '../../services/training-registry.service';
import { ExercisesRegistryService } from '../../../exercises/services/exercises-registry.service';
import { Training } from '../../entities/training.entity';
import { Exercise } from '../../../exercises/entities/exercise.entity';
import { TrainingExercise } from '../../entities/training-exercise.entity';
import { Set } from '../../../exercises/entities/set.entity';

@Component({
  selector: 'app-create-training-form',
  templateUrl: './create-training-form.component.html',
  styleUrls: ['./create-training-form.component.scss'],
  standalone: false,
})
export class CreateTrainingFormComponent implements OnInit {
  @Output() afterCancel = new EventEmitter<void>();
  @Output() afterSubmit = new EventEmitter<Training>();

  form: FormGroup;
  exercisesList: Exercise[] = [];

  constructor(
    private fb: FormBuilder,
    private trainingRegistryService: TrainingRegistryService,
    private exercisesRegistryService: ExercisesRegistryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      exercises: this.fb.array([]),
    });
  }

  async ngOnInit() {
    await this.loadExercises();
    this.addExercise(); // Добавляем первое упражнение по умолчанию
  }

  private async loadExercises() {
    try {
      this.exercisesList = await this.exercisesRegistryService.getAll();
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  }

  get exercises() {
    return this.form.get('exercises') as FormArray;
  }

  addExercise() {
    const exerciseForm = this.fb.group({
      exercise: [null, Validators.required],
      sets: this.fb.array([]),
    });

    this.exercises.push(exerciseForm);
    this.addSetToExerciseFormItem(exerciseForm); // Добавляем первый подход по умолчанию
  }

  removeExercise(index: number) {
    if (this.exercises.length > 1) {
      this.exercises.removeAt(index);
    }
  }

  getSetsFormItems(exerciseFormItem: FormGroup): FormArray {
    return exerciseFormItem.controls['sets'] as FormArray;
  }

  addSetToExerciseFormItem(exerciseFormItem: FormGroup) {
    const setForm = this.fb.group({
      number: [
        this.getSetsFormItems(exerciseFormItem).length + 1,
        Validators.required,
      ],
      reps: [1, [Validators.required, Validators.min(1)]],
      weight: [1, [Validators.required, Validators.min(0)]],
    });

    this.getSetsFormItems(exerciseFormItem).push(setForm);
  }

  removeSet(exerciseFormItem: FormGroup, setIndex: number) {
    const sets = this.getSetsFormItems(exerciseFormItem);
    if (sets.length > 1) {
      sets.removeAt(setIndex);
      // Обновляем номера подходов
      sets.controls.forEach((control, index) => {
        control.patchValue({ number: index + 1 });
      });
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const formValue = this.form.value;
        const training = new Training();
        training.name = formValue.name;

        training.exercises = formValue.exercises.map((te: any) => {
          const trainingExercise = new TrainingExercise();
          trainingExercise.exercise = te.exercise;
          trainingExercise.sets = te.sets.map((set: any) => {
            const newSet = new Set();
            newSet.number = set.number;
            newSet.reps = set.reps;
            newSet.weight = set.weight;
            return newSet;
          });
          return trainingExercise;
        });

        const createdTraining = await this.trainingRegistryService.create(
          training
        );
        this.afterSubmit.emit(createdTraining);
      } catch (error) {
        console.error('Failed to create training:', error);
      }
    }
  }

  onCancel() {
    this.afterCancel.emit();
  }

  stringifyExercise(exercise: Exercise) {
    return exercise.name;
  }
}
