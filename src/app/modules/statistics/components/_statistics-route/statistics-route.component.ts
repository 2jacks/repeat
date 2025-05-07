import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-route',
  templateUrl: './statistics-route.component.html',
  styleUrls: ['./statistics-route.component.scss'],
  standalone: false,
})
export class StatisticsRouteComponent {
  public activeTabIndex = 2;
  public tab = 'user';

  public onClick(tab: string) {
    this.tab = tab;
  }
}
