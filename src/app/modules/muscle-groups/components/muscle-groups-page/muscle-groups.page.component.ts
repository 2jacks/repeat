import { Component } from '@angular/core';
import { MuscleGroupsService } from '../../services/muscle-groups.service';

@Component({
  selector: 'app-muscle-groups-page',
  styleUrl: './muscle-groups.page.component.css',
  templateUrl: './muscle-groups.page.component.html',
  standalone: false,
})
export class MuscleGroupsPageComponent {
  constructor(private _apiService: MuscleGroupsService) {}
}
