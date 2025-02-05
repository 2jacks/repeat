import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExercisesRegistryService } from '../../services/exercises-registry.service';

@Component({
  selector: 'app-create-edit-exercise-form',
  templateUrl: './create-edit-exercise-form.component.html',
  styleUrls: ['./create-edit-exercise-form.component.scss'],
  standalone: false,
})
export class CreateEditExerciseFormComponent {
  exerciseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private registryService: ExercisesRegistryService
  ) {
    this.exerciseForm = this.formBuilder.group({
      name: ['', Validators.required],
      muscle_groups: [[]],
      description: [''],
      mediaUrl: [''],
    });
  }

  onSubmit() {
    if (this.exerciseForm.valid) {
      const exerciseData = this.exerciseForm.value;
      this.registryService.create(exerciseData);
    }
  }
}
