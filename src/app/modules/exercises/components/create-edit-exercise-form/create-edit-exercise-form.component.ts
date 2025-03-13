import {
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  Output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExercisesRegistryService } from '../../services/exercises-registry.service';
import { ToastController } from '@ionic/angular';
import { MuscleGroup } from 'src/app/modules/muscle-groups/entities/muscle-group.entity';
import { MuscleGroupsRegistryService } from 'src/app/modules/muscle-groups/services/muscle-groups-registry.service';
import { I18N } from 'src/app/modules/shared/constants/i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise } from '../../entities/exercise.entity';
import { Location } from '@angular/common';

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

  private _currentExercise!: Exercise;

  public mode: WritableSignal<'edit' | 'create'> = signal('create');
  public titleText: Signal<string> = computed(() =>
    this.mode() === 'edit' ? 'Изменить упражнение' : 'Новое упражнение'
  );
  public confirmButtonText: Signal<string> = computed(() =>
    this.mode() === 'edit' ? 'Изменить' : 'Создать'
  );
  public cancelButtonText: Signal<string> = computed(() =>
    this.mode() === 'edit' ? 'Назад' : 'Отмена'
  );

  @Output() afterSubmit = new EventEmitter<void>();
  @Output() afterCancel = new EventEmitter<void>();

  constructor(
    public i18n: I18N,
    private formBuilder: FormBuilder,
    private exercisesRegistryService: ExercisesRegistryService,
    private muscleGroupsRegistryService: MuscleGroupsRegistryService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef
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

    const exerciseId = Number(this.route.snapshot.paramMap.get('id'));

    if (exerciseId) {
      this.mode.set('edit');

      this.exercisesRegistryService
        .getById(exerciseId)
        .then((res) => {
          if (res) {
            this._currentExercise = res;

            this.exerciseForm.controls['name'].setValue(res.name);
            this.exerciseForm.controls['muscleGroups'].setValue(
              res.muscleGroups
            );
            this.exerciseForm.controls['description'].setValue(res.description);
            // this.exerciseForm.controls['mediaUrl'].setValue(res.);
          }
        })
        .catch((error) => {
          console.error('Failed to get exercise:', error);
        });
    }
  }

  public async onSubmit() {
    if (this.mode() === 'create') {
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
          })
          .catch((error) => {
            this.toastController
              .create({
                message: 'Ошибка при создании упражнения!',
                duration: 3000,
                position: 'top',
                color: 'danger',
              })
              .then((toast) => toast.present());
          })
          .finally(() => {
            this.afterSubmit.emit();
          });
      }
    }
    if (this.mode() === 'edit') {
      if (this.exerciseForm.valid) {
        this._currentExercise.name = this.exerciseForm.value['name'];
        this._currentExercise.description =
          this.exerciseForm.value['description'];
        this._currentExercise.muscleGroups =
          this.exerciseForm.value['muscleGroups'];

        this.exercisesRegistryService
          .update(this._currentExercise)
          .then((res) => {
            this.toastController
              .create({
                message: 'Упражнение изменено!',
                duration: 3000,
                position: 'top',
              })
              .then((toast) => toast.present());
          })
          .finally(() => {
            this.location.back();
          });
      }
    }
  }

  public onCancel() {
    if (this.mode() === 'create') {
      this.exerciseForm.reset();
    }
    if (this.mode() === 'edit') {
      this.location.back();
    }
    this.afterCancel.emit();
  }

  public stringifyMuscleGroup(muscleGroup: MuscleGroup): string {
    return muscleGroup.name;
  }
}
