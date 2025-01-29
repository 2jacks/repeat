import { Component } from '@angular/core';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './app-settings-route.component.html',
  styleUrl: './app-settings-route.component.css',
  standalone: false,
})
export class AppSettingsRouteComponent {
  constructor(private _apiService: AppSettingsService) {}
}
