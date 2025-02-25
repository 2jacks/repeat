import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExercisesRegistryService } from '../../services/exercises-registry.service';
import { ToastController } from '@ionic/angular';
import { MuscleGroup } from 'src/app/modules/muscle-groups/entities/muscle-group.entity';
import { MuscleGroupsRegistryService } from 'src/app/modules/muscle-groups/services/muscle-groups-registry.service';
import { I18N } from 'src/app/modules/shared/constants/i18n';

@Component({
  selector: 'app-create-edit-exercise-form',
  templateUrl: './create-edit-exercise-form.component.html',
  styleUrls: ['./create-edit-exercise-form.component.scss'],
  standalone: false,
})
export class CreateEditExerciseFormComponent {
  public exerciseForm: FormGroup;
  public muscleGroups: MuscleGroup[] = [];
  public muscleGroupsNames: string[] = [];

  @Output() afterSubmit = new EventEmitter<void>();

  constructor(
    public i18n: I18N,
    private formBuilder: FormBuilder,
    private exercisesRegistryService: ExercisesRegistryService,
    private muscleGroupsRegistryService: MuscleGroupsRegistryService,
    private toastController: ToastController
  ) {
    this.exerciseForm = this.formBuilder.group({
      name: ['', Validators.required],
      muscleGroups: [[]],
      description: [''],
      mediaUrl: [''],
    });
  }

  public ngOnInit() {
    this.muscleGroupsRegistryService.getAll().then((res) => {
      this.muscleGroups = res;
    });
  }

  public async onSubmit() {
    if (this.exerciseForm.valid) {
      const exerciseData = this.exerciseForm.value;
      this.exercisesRegistryService
        .create(exerciseData)
        .then((res) => {
          this.toastController
            .create({
              message: 'Новое упражнение добавлено!',
              duration: 3000,
              position: 'top',
            })
            .then((toast) => toast.present());
          this.exercisesRegistryService.getAll().then((res) => {
            console.log(res);
          });
        })
        .finally(() => {
          this.afterSubmit.emit();
        });
    }
  }

  public stringifyMuscleGroup(muscleGroup: MuscleGroup): string {
    return muscleGroup.name;
  }
}
