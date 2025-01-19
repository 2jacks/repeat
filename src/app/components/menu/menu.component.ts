import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: false,
})
export class MenuComponent {
  menuItems = [
    { title: 'Главная', path: '/home', icon: 'home-outline' },
    {
      title: 'Мышечные группы',
      path: '/muscle_groups',
      icon: 'accessibility-outline',
    },
    { title: 'Настройки', path: '/app_settings', icon: 'settings-outline' },
  ];

  @Output() navigationEnd: EventEmitter<void> = new EventEmitter();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onNavigationEnd();
      }
    });
  }

  onNavigationEnd() {
    this.navigationEnd.emit();
  }
}
