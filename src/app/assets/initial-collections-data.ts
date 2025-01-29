export type ICollectionsKeys =
  | 'exercises'
  | 'muscle_groups'
  | 'app_settings'
  | 'user_data';
export type TInitialCollectionsData = Partial<Record<ICollectionsKeys, any>>;

export const INITIAL_COLLECTIONS_DATA: TInitialCollectionsData = {
  muscle_groups: [
    { id: 1, name: 'Спина' },
    { id: 2, name: 'Грудь' },
    { id: 3, name: 'Ноги' },
    { id: 4, name: 'Плечи' },
    { id: 5, name: 'Бицепс' },
    { id: 6, name: 'Трицепс' },
    { id: 7, name: 'Мышцы кора' },
  ],
  exercises: [
    {
      id: 1,
      name: 'Жим лёжа',
      muscle_groups: [2, 4, 6],
      description:
        'Базовое упражнение. Задействует грудные мыщцы, трицепс и передние дельты',
    },
    {
      id: 2,
      name: 'Становая тяга',
      muscle_groups: [1],
      description: 'Базовое упражнение.',
    },
    {
      id: 3,
      name: 'Приседания со штангой',
      muscle_groups: [3],
      description: 'Базовое упражнение.',
    },
    {
      id: 4,
      name: 'Подъем штанги на бицепс',
      muscle_groups: [5],
      description: 'Базовое упражнение.',
    },
  ],
};
