import { Injectable, NgZone } from '@angular/core';
import { getEvenlySpacedDates } from '../../shared/utils/utils';

// @ts-ignore
import ApexCharts from 'apexcharts';

const CHART_COMMON_CONFIG = {
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
    animations: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
  },
};

@Injectable()
export class ChartService {
  constructor(private ngZone: NgZone) {}

  public createWeightProgressionChart(
    container: HTMLElement,
    data: { date: number; weight: number }[]
  ): void {
    this.ngZone.runOutsideAngular(() => {
      if (!container) return;

      const chart = new ApexCharts(container, {
        ...CHART_COMMON_CONFIG,
        series: [
          {
            name: 'Вес',
            data: data.map((item) => item.weight),
          },
        ],
        yaxis: {
          title: {
            text: 'Вес (кг)',
          },
        },
        xaxis: {
          categories: data.map((item) =>
            new Date(item.date).toLocaleDateString()
          ),
          title: {
            text: 'Дата',
          },
          tickAmount: 3,
          labels: {
            rotate: 0,
            rotateAlways: false,
          },
        },
      });

      chart.render();
    });
  }

  public createRepsProgressionChart(
    container: HTMLElement,
    data: { date: number; reps: number }[]
  ): void {
    this.ngZone.runOutsideAngular(() => {
      if (!container) return;

      const chart = new ApexCharts(container, {
        ...CHART_COMMON_CONFIG,
        series: [
          {
            name: 'Повторения',
            data: data.map((item) => item.reps),
          },
        ],
        yaxis: {
          title: {
            text: 'Кол-во повторений',
          },
        },
        xaxis: {
          categories: data.map((item) =>
            new Date(item.date).toLocaleDateString()
          ),
          title: {
            text: 'Дата',
          },
          tickAmount: 3,
          labels: {
            rotate: 0,
            rotateAlways: false,
          },
        },
      });

      chart.render();
    });
  }
}
