import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingRegistryService } from '../../services/training-registry.service';
import { ExercisesRegistryService } from '../../../exercises/services/exercises-registry.service';
import { Training } from '../../entities/training.entity';
import { Exercise } from '../../../exercises/entities/exercise.entity';
import { TrainingExercise } from '../../entities/training-exercise.entity';

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
  exercises: Exercise[] = [];

  constructor(
    private fb: FormBuilder,
    private trainingRegistryService: TrainingRegistryService,
    private exercisesRegistryService: ExercisesRegistryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      trainingExercises: this.fb.array([]),
    });
  }

  async ngOnInit() {
    await this.loadExercises();
    this.addExercise(); // Добавляем первое упражнение по умолчанию
  }

  private async loadExercises() {
    try {
      this.exercises = await this.exercisesRegistryService.getAll();
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  }

  get trainingExercises() {
    return this.form.get('trainingExercises') as FormArray;
  }

  addExercise() {
    const exerciseForm = this.fb.group({
      exercise: [null, Validators.required],
      sets: [3, [Validators.required, Validators.min(1)]],
      reps: [12, [Validators.required, Validators.min(1)]],
    });

    this.trainingExercises.push(exerciseForm);
  }

  removeExercise(index: number) {
    if (this.trainingExercises.length > 1) {
      this.trainingExercises.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const formValue = this.form.value;
        const training = new Training();
        training.name = formValue.name;

        training.trainingExercises = formValue.trainingExercises.map(
          (te: any) => {
            const trainingExercise = new TrainingExercise();
            trainingExercise.exercise = te.exercise;
            trainingExercise.sets = te.sets;
            trainingExercise.reps = te.reps;
            return trainingExercise;
          }
        );

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
