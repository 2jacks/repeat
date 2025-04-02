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
        "sets" INTEGER NOT NULL,
        "reps" INTEGER NOT NULL,
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
      `INSERT INTO training_to_exercise (training_id, exercise_id, sets, reps) VALUES
        (1, 1, 3, 12),
        (1, 4, 3, 12),
        (2, 2, 3, 8);
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
