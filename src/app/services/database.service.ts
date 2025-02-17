import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from '@capacitor-community/sqlite';
import { Environment } from '../environment';

@Injectable()
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isDbReadonly = false;

  constructor(private env: Environment) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  /**
   * Возвращает экземпляр подключения к базе данных.
   * Если база данных не инициализирована, выбрасывает ошибку.
   */
  public getDatabaseConnection(): SQLiteDBConnection {
    if (!this.db) {
      throw new Error(
        'База данных не инициализирована. Сначала вызовите initializeDatabase().'
      );
    }
    return this.db;
  }

  /**
   * Закрывает подключение к базе данных.
   */
  public async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.sqlite.closeConnection(
        this.env.DATABASE_NAME,
        this.isDbReadonly
      );
      this.db = null;
    }
  }

  /**
   * Инициализирует базу данных и возвращает экземпляр подключения.
   * Если база данных уже инициализирована, возвращает существующее подключение.
   */
  public async initializeDatabase(): Promise<SQLiteDBConnection> {
    if (this.db) {
      return this.db; // Возвращаем существующее подключение, если оно уже есть
    }

    if (Capacitor.getPlatform() === 'web') {
      await this._initWebStore();
    }

    try {
      // Проверяем, существует ли подключение к базе данных
      const isConnectionExists = (
        await this.sqlite.isConnection(
          this.env.DATABASE_NAME,
          this.isDbReadonly
        )
      ).result;

      if (!isConnectionExists) {
        // Если подключение не существует, создаем его
        this.db = await this.sqlite.createConnection(
          this.env.DATABASE_NAME,
          false,
          'no-encryption',
          1,
          this.isDbReadonly
        );
        await this.db.open();
      } else {
        // Если подключение существует, используем его
        this.db = await this.sqlite.retrieveConnection(
          this.env.DATABASE_NAME,
          this.isDbReadonly
        );
      }

      // Выполняем начальное заполнение базы данных (если необходимо)
      // await this._initializeData();

      return this.db;
    } catch (error) {
      console.error('Ошибка при инициализации базы данных:', error);
      throw error;
    }
  }

  /**
   * Выполняет начальное заполнение базы данных (например, создание таблиц и добавление начальных данных).
   */
  private async _initializeData(): Promise<void> {
    if (!this.db) {
      throw new Error('База данных не инициализирована');
    }

    // Создаем таблицы, если они еще не существуют
    const createTableQuery = `
        -- Создание таблицы muscle_groups
        CREATE TABLE IF NOT EXISTS muscle_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- Первичный ключ
            name TEXT NOT NULL UNIQUE            -- Название группы мышц (уникальное)
        );

        -- Создание таблицы exercises
        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- Первичный ключ
            name TEXT NOT NULL UNIQUE,           -- Название упражнения (уникальное)
            description TEXT            -- Название упражнения (уникальное)
        );

        -- Создание вспомогательной таблицы muscle_group_exercises
        CREATE TABLE IF NOT EXISTS muscle_group_exercises (
            muscle_group_id INTEGER NOT NULL,     -- Ссылка на muscle_groups.id
            exercise_id INTEGER NOT NULL,         -- Ссылка на exercises.id
            PRIMARY KEY (muscle_group_id, exercise_id), -- Составной первичный ключ
            FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id) ON DELETE CASCADE,
            FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
        );
    `;
    await this.db.execute(createTableQuery);

    const fillDefaultDataQuery1 = `
      INSERT OR IGNORE INTO muscle_groups (id, name) VALUES
        (1, 'Спина'),
        (2, 'Грудь'),
        (3, 'Ноги'),
        (4, 'Плечи'),
        (5, 'Бицепс'),
        (6, 'Трицепс'),
        (7, 'Мышцы кора');
    `;
    const fillDefaultDataQuery2 = `
      INSERT OR IGNORE INTO exercises (id, name, description) VALUES
        (1, 'Жим лёжа', 'Базовое упражнение. Задействует грудные мышцы, трицепс и передние дельты'),
        (2, 'Становая тяга', 'Базовое упражнение.'),
        (3, 'Приседания со штангой', 'Базовое упражнение.'),
        (4, 'Подъем штанги на бицепс', 'Базовое упражнение.');
    `;
    const fillDefaultDataQuery3 = `
      INSERT OR IGNORE INTO muscle_group_exercises (exercise_id, muscle_group_id) VALUES
        (1, 2), -- Жим лёжа -> Грудь
        (1, 4), -- Жим лёжа -> Плечи
        (1, 6), -- Жим лёжа -> Трицепс
        (2, 1), -- Становая тяга -> Спина
        (3, 3), -- Приседания со штангой -> Ноги
        (4, 5); -- Подъем штанги на бицепс -> Бицепс
    `;

    await this.db.run(fillDefaultDataQuery1);
    await this.db.run(fillDefaultDataQuery2);
    await this.db.run(fillDefaultDataQuery3);

    // // Добавляем начальные данные, если таблица пуста
    // const checkDataQuery = `SELECT COUNT(*) as count FROM users;`;
    // const result = await this.db.query(checkDataQuery);
    // if (result.values && result.values[0].count === 0) {
    //   const insertQuery = `INSERT INTO users (name, email) VALUES (?, ?);`;
    //   await this.db.run(insertQuery, ['John Doe', 'john@example.com']);
    //   await this.db.run(insertQuery, ['Jane Doe', 'jane@example.com']);
    // }
  }

  private async _initWebStore(): Promise<void> {
    try {
      await this.sqlite.initWebStore();
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${msg}`);
    }
  }
}
