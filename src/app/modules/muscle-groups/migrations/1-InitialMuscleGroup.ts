import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMuscleGroup1 implements MigrationInterface {
  name = 'InitialMuscleGroup1';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS muscle_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- Первичный ключ
            name TEXT NOT NULL UNIQUE            -- Название группы мышц (уникальное)
        );
			`
    );
    await queryRunner.query(
      `INSERT OR IGNORE INTO muscle_groups (id, name) VALUES
        (1, 'Спина'),
        (2, 'Грудь'),
        (3, 'Ноги'),
        (4, 'Плечи'),
        (5, 'Бицепс'),
        (6, 'Трицепс'),
        (7, 'Мышцы кора');
			`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP INDEX "IDX_a5e63f80ca58e7296d5864bd2d"`);
  }
}
