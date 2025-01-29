import { Component } from '@angular/core';
import { MuscleGroupsService } from '../../services/muscle-groups.service';

@Component({
  selector: 'app-muscle-groups-page',
  styleUrl: './muscle-groups-route.component.css',
  templateUrl: './muscle-groups-route.component.html',
  standalone: false,
})
export class MuscleGroupsRouteComponent {
  constructor(private _apiService: MuscleGroupsService) {}
}
