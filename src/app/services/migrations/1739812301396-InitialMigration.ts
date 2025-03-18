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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "training_to_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "muscle_group_to_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "muscle_group"`);
  }
}
