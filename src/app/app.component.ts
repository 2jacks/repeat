import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { Router } from '@angular/router';

interface ITabItem {
  label: string;
  path: string;
  icon: string;
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
      icon: 'triangle',
      path: 'exercises',
    },
    {
      label: 'Today',
      icon: 'square',
      path: 'home',
    },
    {
      label: 'More on Food',
      icon: 'triangle',
      path: 'food',
    },
  ];
  public activeItemIndex: number = 1;

  constructor(
    private dbService: DatabaseService,
    private menuController: MenuController,
    private router: Router
  ) {}

  ngOnInit() {
    this.dbService.initializeDatabase().then(() => {
      setTimeout(() => {
        this.isDatabaseInitialized = true;
      }, 3000);
    });
  }

  public onTabClick(tab: ITabItem) {
    this.router.navigate([tab.path]);
  }

  closeMenu() {
    this.menuController.close();
  }
}
