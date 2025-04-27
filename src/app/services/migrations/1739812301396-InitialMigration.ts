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
        "training_id" INTEGER,
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

    // Создание начальной записи в current
    await queryRunner.query(`
      INSERT INTO current (id) VALUES (1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "completed_exercise_set"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "completed_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "completed_training"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training_exercise_set"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "_set"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "current"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "training_program_to_training"`
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "training_program"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training_to_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "training"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "muscle_group_to_exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exercise"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "muscle_group"`);
  }
}
