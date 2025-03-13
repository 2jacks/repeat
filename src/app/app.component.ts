import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface ITabItem {
  label: string;
  path: string;
  icon: string;
  children?: ITabItem[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent {
  public isDatabaseInitialized: boolean = false;
  public tabs: ITabItem[] = [
    {
      label: 'More on Train',
      icon: 'dumbbell',
      path: 'workout',
      children: [
        {
          label: 'Упражнения',
          path: 'exercises',
          icon: 'dumbbell',
        },
        {
          label: 'Тренировки',
          path: 'training',
          icon: 'land-plot',
        },
      ],
    },
    {
      label: 'Today',
      icon: 'calendar-range',
      path: 'home',
    },
    {
      label: 'More on Food',
      icon: 'apple',
      path: 'food',
    },
  ];
  public activeItemIndex: number = this.getActiveTabIndex();

  public isDropdownOpen: boolean = false;

  constructor(
    private dbService: DatabaseService,
    private menuController: MenuController,
    private router: Router,
    private location: Location
  ) {}

  private getActiveTabIndex(): number {
    const currentPath = this.location.path().split('/')[1];
    if (!currentPath) {
      return 1; // Если путь пустой, возвращаем индекс "Today"
    }

    const index = this.tabs.findIndex((tab) => tab.path === currentPath);
    return index >= 0 ? index : 1;
  }

  ngOnInit() {
    this.dbService.initializeDatabase().then(() => {
      this.isDatabaseInitialized = true;

      this.activeItemIndex = this.getActiveTabIndex();
    });
  }

  public onTabClick(tab: ITabItem) {
    this.router.navigate([tab.path]);
  }

  closeMenu() {
    this.menuController.close();
  }

  protected toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  protected onActiveZone(active: boolean): void {
    this.isDropdownOpen = active && this.isDropdownOpen;
  }
}
