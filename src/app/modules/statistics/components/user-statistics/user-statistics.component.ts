import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

interface UserData {
  height: number;
  gender: FormControl<string | null>;
  activityLevel: FormControl<string | null>;
  age: number;
}

interface WeightRecord {
  date: Date;
  weight: number;
  bmi: number;
}

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss'],
  standalone: false,
})
export class UserStatisticsComponent implements OnInit {
  public gendersList = ['Мужской', 'Женский'];
  public activityLevelsList = [
    'Низкий (сидячий образ жизни)',
    'Средний (умеренные тренировки)',
    'Высокий (интенсивные тренировки)',
  ];
  private readonly activityMultipliers = {
    'Низкий (сидячий образ жизни)': 1.2,
    'Средний (умеренные тренировки)': 1.375,
    'Высокий (интенсивные тренировки)': 1.55,
  };

  public userData: UserData = {
    height: 175,
    gender: new FormControl<string>('Мужской'),
    activityLevel: new FormControl<string>('Низкий (сидячий образ жизни)'),
    age: 30,
  };

  public weightRecords: WeightRecord[] = [];
  public newWeight: number = 0;
  public dailyCalories: number = 0;

  ngOnInit() {
    // Инициализация тестовых данных
    const today = new Date();

    this.weightRecords = [
      {
        date: new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          today.getDate()
        ),
        weight: 85,
        bmi: this.calculateBMI(85),
      },
      {
        date: new Date(
          today.getFullYear(),
          today.getMonth() - 2,
          today.getDate()
        ),
        weight: 82,
        bmi: this.calculateBMI(82),
      },
      {
        date: new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        ),
        weight: 79,
        bmi: this.calculateBMI(79),
      },
      {
        date: today,
        weight: 76,
        bmi: this.calculateBMI(76),
      },
    ];

    this.getDailyCalories();
  }

  getWeightRecords() {
    this.weightRecords.forEach((record) => {
      record.bmi = this.calculateBMI(record.weight);
    });

    return this.weightRecords;
  }

  public calculateBMI(weight: number): number {
    // BMI = weight (kg) / (height (m))²
    const heightInMeters = this.userData.height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  public addWeightRecord(): void {
    if (this.newWeight > 0) {
      const newRecord: WeightRecord = {
        date: new Date(),
        weight: this.newWeight,
        bmi: this.calculateBMI(this.newWeight),
      };
      this.weightRecords.push(newRecord);
      this.newWeight = 0;
      this.getDailyCalories();
    }
  }

  public getDailyCalories() {
    if (this.weightRecords.length === 0) return;

    const lastWeight = this.weightRecords[this.weightRecords.length - 1].weight;

    // Формула Харриса-Бенедикта
    let bmr: number;
    if (this.userData.gender.value === 'Мужской') {
      bmr =
        88.362 +
        13.397 * lastWeight +
        4.799 * this.userData.height -
        5.677 * this.userData.age;
    } else {
      bmr =
        447.593 +
        9.247 * lastWeight +
        3.098 * this.userData.height -
        4.33 * this.userData.age;
    }

    this.dailyCalories = Math.round(
      // @ts-ignore
      bmr * this.activityMultipliers[this.userData.activityLevel.value]
    );

    return this.dailyCalories;
  }

  public onUserDataChange(): void {
    // Пересчитываем BMI для всех записей при изменении роста
    this.weightRecords = this.weightRecords.map((record) => ({
      ...record,
      bmi: this.calculateBMI(record.weight),
    }));
    this.getDailyCalories();
  }
}
