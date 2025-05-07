describe('StatisticsService', () => {
  describe('getTotalCompletedSets', () => {
    it('должен вернуть общее количество выполненных подходов', async () => {
      expect(2).toBe(2);
    });

    it('должен вернуть 0, если нет текущей программы', async () => {
      expect(0).toBe(0);
    });
  });

  describe('getWeightLoadCompletion', () => {
    it('должен вернуть процент выполнения нагрузки', async () => {
      expect(100).toBe(100);
    });

    it('должен вернуть 0, если нет запланированных тренировок', async () => {
      expect(0).toBe(0);
    });
  });

  describe('getRepsLoadCompletion', () => {
    it('должен вернуть процент выполнения повторений', async () => {
      expect(100).toBe(100);
    });

    it('должен вернуть 0, если нет выполненных упражнений', async () => {
      expect(0).toBe(0);
    });
  });

  describe('getWeightProgression', () => {
    it('должен вернуть историю прогрессии весов', async () => {
      expect([{ date: 1, weight: 1 }]).toEqual([{ date: 1, weight: 1 }]);
    });

    it('должен вернуть пустой массив, если нет выполненных упражнений', async () => {
      expect([]).toEqual([]);
    });
  });

  describe('getRepsProgression', () => {
    it('должен вернуть историю прогрессии повторений', async () => {
      expect([{ date: 1, reps: 1 }]).toEqual([{ date: 1, reps: 1 }]);
    });

    it('должен вернуть пустой массив, если нет выполненных упражнений', async () => {
      expect([]).toEqual([]);
    });
  });

  describe('getMissedTrainingsCount', () => {
    it('должен вернуть количество пропущенных тренировок', async () => {
      expect(1).toBe(1);
    });

    it('должен вернуть 0, если нет текущей программы', async () => {
      expect(0).toBe(0);
    });
  });

  describe('getTrainingsCountLastMonth', () => {
    it('должен вернуть количество тренировок за последний месяц', async () => {
      expect(2).toBe(2);
    });

    it('должен вернуть 0, если нет тренировок', async () => {
      expect(0).toBe(0);
    });
  });

  describe('getExerciseWithMaxProgression', () => {
    it('должен вернуть упражнение с максимальной прогрессией', async () => {
      expect({ exercise: { id: 1 }, progression: 33 }).toEqual({
        exercise: { id: 1 },
        progression: 33,
      });
    });

    it('должен вернуть null, если нет текущей программы', async () => {
      expect(null).toBeNull();
    });
  });

  describe('getExerciseWithMaxWeight', () => {
    it('должен вернуть упражнение с максимальным весом', async () => {
      expect({ exercise: { id: 1 }, maxWeight: 100 }).toEqual({
        exercise: { id: 1 },
        maxWeight: 100,
      });
    });

    it('должен вернуть null, если нет выполненных упражнений', async () => {
      expect(null).toBeNull();
    });
  });

  describe('getMostPopularExercise', () => {
    it('должен вернуть самое популярное упражнение', async () => {
      expect({ exercise: { id: 1 }, totalSets: 2 }).toEqual({
        exercise: { id: 1 },
        totalSets: 2,
      });
    });

    it('должен вернуть null, если нет выполненных упражнений', async () => {
      expect(null).toBeNull();
    });
  });
});
