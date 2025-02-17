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
      CREATE TABLE IF NOT EXISTS "muscle_group_exercise" (
        "exercise_id" INTEGER NOT NULL,
        "muscle_group_id" INTEGER NOT NULL,
        PRIMARY KEY ("muscle_group_id", "exercise_id"),
        FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_group"("id") ON DELETE CASCADE,
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
      `INSERT INTO muscle_group_exercise (exercise_id, muscle_group_id) VALUES
        (1, 2),
        (1, 4),
        (1, 6),
        (2, 1),
        (3, 3),
        (4, 5);
    	`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP INDEX "IDX_a5e63f80ca58e7296d5864bd2d"`);
  }
}
