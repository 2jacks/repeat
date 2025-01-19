import { Component } from '@angular/core';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './app-settings.page.component.html',
  styleUrl: './app-settings.page.component.css',
  standalone: false,
})
export class AppSettingsPageComponent {
  constructor(private _apiService: AppSettingsService) {}
}
