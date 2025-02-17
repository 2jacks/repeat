import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent {
  constructor(
    private dbService: DatabaseService,
    private menuController: MenuController
  ) {}

  public isDatabaseInitialized: boolean = false;

  ngOnInit() {
    this.dbService.initializeDatabase().then(() => {
      setTimeout(() => {
        this.isDatabaseInitialized = true;
      }, 3000);
    });
  }

  closeMenu() {
    this.menuController.close();
  }
}
