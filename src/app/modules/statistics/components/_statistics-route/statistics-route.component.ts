import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-route',
  templateUrl: './statistics-route.component.html',
  styleUrls: ['./statistics-route.component.scss'],
  standalone: false,
})
export class StatisticsRouteComponent {
  public activeTabIndex = 1;
  public tab = 'exerises';

  public onClick(tab: string) {
    this.tab = tab;
  }
}
