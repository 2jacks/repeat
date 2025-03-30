```mermaid
erDiagram
    TRAINING {
        int id PK "Идентификатор тренировки"
        string name "Название тренировки"
    }

    EXERCISE {
        int id PK "Идентификатор упражнения"
        string name UK "Название упражнения"
        string description "Описание упражнения"
    }

    MUSCLE_GROUP {
        int id PK "Идентификатор группы мышц"
        string name "Название группы мышц"
    }

    TRAINING_EXERCISE {
        int id PK "Идентификатор связи"
        int training_id FK "Ссылка на тренировку"
        int exercise_id FK "Ссылка на упражнение"
        int sets "Количество подходов"
        int reps "Количество повторений"
    }

    MUSCLE_GROUP_EXERCISE {
        int exercise_id FK "Ссылка на упражнение"
        int muscle_group_id FK "Ссылка на группу мышц"
    }

    TRAINING_PROGRAM {
        int id PK "Идентификатор программы"
        string name "Название программы"
        string description "Описание программы"
        int duration_weeks "Длительность программы в неделях"
        string goal "Цель программы (набор массы, похудение, сила и т.д.)"
    }

    TRAINING_PROGRAM_TRAINING {
        int id PK "Идентификатор расписания"
        int program_id FK "Ссылка на программу"
        int training_id FK "Ссылка на тренировку"
        int day_of_week "День недели (1-7)"
    }

    COMPLETED_TRAINING {
        int id PK "Идентификатор проведенной тренировки"
        int program_id FK "Ссылка на программу"
        int training_id FK "Ссылка на тренировку-шаблон"
        int schedule_id FK "Ссылка на расписание"
        boolean is_completed "Тренировка завершена"
    }

    COMPLETED_EXERCISE {
        int id PK "Идентификатор выполненного упражнения"
        int completed_training_id FK "Ссылка на проведенную тренировку"
        int exercise_id FK "Ссылка на упражнение"
        int planned_sets "Плановое количество подходов"
        int planned_reps "Плановое количество повторений"
        int actual_sets "Фактическое количество подходов"
        int actual_reps "Фактическое количество повторений"
        float weight "Использованный вес"
    }

    TRAINING ||--o{ TRAINING_EXERCISE : ""
    EXERCISE ||--o{ TRAINING_EXERCISE : ""
    EXERCISE ||--o{ MUSCLE_GROUP_EXERCISE : ""
    MUSCLE_GROUP ||--o{ MUSCLE_GROUP_EXERCISE : ""
    TRAINING_PROGRAM ||--o{ TRAINING_PROGRAM_TRAINING : ""
    TRAINING ||--o{ TRAINING_PROGRAM_TRAINING : ""
    TRAINING_PROGRAM ||--o{ COMPLETED_TRAINING : ""
    TRAINING ||--o{ COMPLETED_TRAINING : ""
    TRAINING_PROGRAM_TRAINING ||--o{ COMPLETED_TRAINING : ""
    COMPLETED_TRAINING ||--o{ COMPLETED_EXERCISE : ""
    EXERCISE ||--o{ COMPLETED_EXERCISE : ""
```
