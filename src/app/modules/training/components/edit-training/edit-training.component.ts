import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TrainingRegistryService } from '../../services/training-registry.service';
import { ExercisesRegistryService } from '../../../exercises/services/exercises-registry.service';
import { Training } from '../../entities/training.entity';
import { Exercise } from '../../../exercises/entities/exercise.entity';
import { TrainingExercise } from '../../entities/training-exercise.entity';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss'],
  standalone: false,
})
export class EditTrainingComponent implements OnInit {
  form: FormGroup;
  exercisesList: Exercise[] = [];
  training: Training | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private trainingRegistryService: TrainingRegistryService,
    private exercisesRegistryService: ExercisesRegistryService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      exercises: this.fb.array([]),
    });
  }

  async ngOnInit() {
    await this.loadExercises();
    await this.loadTraining();
  }

  private async loadExercises() {
    try {
      this.exercisesList = await this.exercisesRegistryService.getAll();
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  }

  private async loadTraining() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      try {
        this.training = await this.trainingRegistryService.getById(id);
        if (this.training) {
          this.form.patchValue({
            name: this.training.name,
          });

          // Очищаем существующие упражнения
          while (this.exercises.length) {
            this.exercises.removeAt(0);
          }

          // Добавляем существующие упражнения
          this.training.exercises.forEach((te) => {
            this.exercises.push(
              this.fb.group({
                id: [te.id],
                exercise: [te.exercise, Validators.required],
                sets: [te.sets, [Validators.required]],
              })
            );
          });
        }
      } catch (error) {
        console.error('Failed to load training:', error);
      }
    }
  }

  get exercises() {
    return this.form.get('exercises') as FormArray;
  }

  addExercise() {
    const exerciseForm = this.fb.group({
      id: [null],
      exercise: [null, Validators.required],
      sets: [3, [Validators.required]],
    });

    this.exercises.push(exerciseForm);
  }

  removeExercise(index: number) {
    if (this.exercises.length > 1) {
      this.exercises.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.form.valid && this.training) {
      try {
        const formValue = this.form.value;
        this.training.name = formValue.name;

        // Обновляем существующие упражнения и добавляем новые
        this.training.exercises = formValue.exercises.map((formTE: any) => {
          const trainingExercise = formTE.id
            ? this.training!.exercises.find((te) => te.id === formTE.id) ||
              new TrainingExercise()
            : new TrainingExercise();

          trainingExercise.exercise = formTE.exercise;
          trainingExercise.sets = formTE.sets;
          return trainingExercise;
        });

        await this.trainingRegistryService.update(this.training);
        this.location.back();
      } catch (error) {
        console.error('Failed to update training:', error);
      }
    }
  }

  onCancel() {
    this.location.back();
  }

  stringifyExercise(exercise: Exercise) {
    return exercise.name;
  }
}
