import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-route',
  template: `
    <div class="statistics-container">
      <app-completed-training-list></app-completed-training-list>
    </div>
  `,
  styleUrls: ['./statistics-route.component.scss'],
  standalone: false,
})
export class StatisticsRouteComponent {}
