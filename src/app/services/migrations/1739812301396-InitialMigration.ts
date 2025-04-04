import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1739812301396 implements MigrationInterface {
  name = 'InitialMigration1739812301396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы muscle_groups
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "muscle_group" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL UNIQUE
      );
    `);

    // Создание таблицы exercises
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exercise" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "description" TEXT
      );
    `);

    // Создание связующей таблицы для отношения "многие ко многим"
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "muscle_group_to_exercise" (
        "exercise_id" INTEGER NOT NULL,
        "muscle_group_id" INTEGER NOT NULL,
        PRIMARY KEY ("muscle_group_id", "exercise_id"),
        FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_group"("id") ON DELETE CASCADE,
        FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE
      );
    `);

    // Создание таблицы training
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "training" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL
      );
    `);

    // Создание связующей таблицы training_exercise
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "training_to_exercise" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "training_id" INTEGER NOT NULL,
        "exercise_id" INTEGER NOT NULL,
        FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE CASCADE,
        FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE
      );
    `);

    // Создание таблицы training_program
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "training_program" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "duration_weeks" INTEGER NOT NULL,
        "goal" TEXT NOT NULL
      );
    `);

    // Создание таблицы training_program_training
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "training_program_to_training" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "program_id" INTEGER NOT NULL,
        "training_id" INTEGER NOT NULL,
        "day_of_week" INTEGER NOT NULL,
        FOREIGN KEY ("program_id") REFERENCES "training_program"("id") ON DELETE CASCADE,
        FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE CASCADE
      );
    `);

    // Создание таблицы current
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "current" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "active_training_program" INTEGER UNIQUE,
        "training_program_start" INTEGER,
        FOREIGN KEY ("active_training_program") REFERENCES "training_program"("id") ON DELETE SET NULL
      );
    `);

    // Создание таблицы set
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "_set" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "number" INTEGER NOT NULL,
        "reps" INTEGER NOT NULL,
        "weight" REAL NOT NULL
      );
    `);

    // Создание связующей таблицы training_exercise_set
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "training_exercise_set" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "training_exercise_id" INTEGER NOT NULL,
        "set_id" INTEGER NOT NULL,
        FOREIGN KEY ("training_exercise_id") REFERENCES "training_to_exercise"("id") ON DELETE CASCADE,
        FOREIGN KEY ("set_id") REFERENCES "_set"("id") ON DELETE CASCADE
      );
    `);

    // Создание таблицы completed_training
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "completed_training" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "training_id" INTEGER NOT NULL,
        "date" INTEGER NOT NULL,
        FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE CASCADE
      );
    `);

    // Создание таблицы completed_exercise
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "completed_exercise" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "completed_training_id" INTEGER NOT NULL,
        "exercise_id" INTEGER NOT NULL,
        FOREIGN KEY ("completed_training_id") REFERENCES "completed_training"("id") ON DELETE CASCADE,
        FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE CASCADE
      );
    `);

    // Создание связующей таблицы completed_exercise_set
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "completed_exercise_set" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "completed_exercise_id" INTEGER NOT NULL,
        "set_id" INTEGER NOT NULL,
        FOREIGN KEY ("completed_exercise_id") REFERENCES "completed_exercise"("id") ON DELETE CASCADE,
        FOREIGN KEY ("set_id") REFERENCES "_set"("id") ON DELETE CASCADE
      );
    `);

    // Insert MuscleGroups
    await queryRunner.query(
      `INSERT INTO muscle_group (id, name) VALUES
        (1, 'Спина'),
        (2, 'Грудь'),
        (3, 'Ноги'),
        (4, 'Плечи'),
        (5, 'Бицепс'),
        (6, 'Трицепс'),
        (7, 'Мышцы кора');
			`
    );

    // Insert Exercises
    await queryRunner.query(
      `INSERT INTO exercise (id, name, description) VALUES
        (1, 'Жим лёжа', 'Базовое упражнение. Задействует грудные мыщцы, трицепс и передние дельты'),
        (2, 'Становая тяга', 'Базовое упражнение'),
        (3, 'Приседания со штангой', 'Базовое упражнение'),
        (4, 'Подъем штанги на бицепс', 'Базовое упражнение');
			`
    );

    // Insert MuscleGroup-Exercises
    await queryRunner.query(
      `INSERT INTO muscle_group_to_exercise (exercise_id, muscle_group_id) VALUES
        (1, 2),
        (1, 4),
        (1, 6),
        (2, 1),
        (3, 3),
        (4, 5);
    	`
    );

    // Insert Training
    await queryRunner.query(
      `INSERT INTO training (id, name) VALUES
        (1, 'Тренировка груди'),
        (2, 'Тренировка спины');
      `
    );

    // Insert TrainingExercises
    await queryRunner.query(
      `INSERT INTO training_to_exercise (training_id, exercise_id) VALUES
        (1, 1),
        (1, 4),
        (2, 2);
      `
    );

    // Insert Sets
    await queryRunner.query(
      `INSERT INTO _set (id, number, reps, weight) VALUES
        (1, 1, 12, 60.0),
        (2, 2, 12, 65.0),
        (3, 3, 10, 70.0),
        (4, 1, 8, 100.0),
        (5, 2, 8, 105.0),
        (6, 3, 6, 110.0),
        (7, 1, 12, 30.0),
        (8, 2, 12, 32.5),
        (9, 3, 10, 35.0);
      `
    );

    // Insert TrainingExerciseSets
    await queryRunner.query(
      `INSERT INTO training_exercise_set (training_exercise_id, set_id) VALUES
        (1, 1),
        (1, 2),
        (1, 3),
        (2, 4),
        (2, 5),
        (2, 6),
        (3, 7),
        (3, 8),
        (3, 9);
      `
    );

    // Вставка тренировочных программ
    await queryRunner.query(
      `INSERT INTO training_program (id, name, description, duration_weeks, goal) VALUES
        (1, 'Программа для начинающих', 'Программа для начинающих на 4 недели', 4, 'Похудение'),
        (2, 'Программа для продвинутых', 'Программа для продвинутых на 8 недель', 8, 'Набор массы');
      `
    );

    // Вставка тренировок в программы
    await queryRunner.query(
      `INSERT INTO training_program_to_training (program_id, training_id, day_of_week) VALUES
        (1, 1, 1),
        (1, 2, 3),
        (2, 1, 2),
        (2, 2, 4);
      `
    );

    // Вставка начальной записи в current
    await queryRunner.query(`
      INSERT INTO current (id, active_training_program, training_program_start) VALUES (1, NULL, NULL);
    `);

    // Вставка примера выполненной тренировки
    await queryRunner.query(`
      INSERT INTO completed_training (id, training_id, date) VALUES 
        (1, 1, ${Date.now()});
    `);

    // Вставка примера выполненных упражнений
    await queryRunner.query(`
      INSERT INTO completed_exercise (id, completed_training_id, exercise_id) VALUES 
        (1, 1, 1),
        (2, 1, 4);
    `);

    // Вставка примеров выполненных подходов
    await queryRunner.query(`
      INSERT INTO _set (id, number, reps, weight) VALUES 
        (10, 1, 12, 62.5),
        (11, 2, 12, 65.0),
        (12, 3, 10, 67.5),
        (13, 1, 12, 32.5),
        (14, 2, 12, 35.0),
        (15, 3, 10, 37.5);
    `);

    // Связывание выполненных подходов с выполненными упражнениями
    await queryRunner.query(`
      INSERT INTO completed_exercise_set (completed_exercise_id, set_id) VALUES 
        (1, 10),
        (1, 11),
        (1, 12),
        (2, 13),
        (2, 14),
        (2, 15);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "completed_exercise_set"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "completed_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "completed_training"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training_exercise_set"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "_set"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "current"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training_program_training"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training_program"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training_to_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "muscle_group_to_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "muscle_group"`);
  }
}
