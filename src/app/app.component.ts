import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from './services/database.service';
import { getRepository } from 'typeorm';
import { dataSourceMuscleGroup } from './modules/muscle-groups/muscle-group.data-source';

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
    this.dbService.initializeDatabase().then(async () => {
      console.log(dataSourceMuscleGroup);
    });
  }

  closeMenu() {
    this.menuController.close();
  }
}
