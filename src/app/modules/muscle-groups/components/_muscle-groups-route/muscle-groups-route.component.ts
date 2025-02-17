import { Component } from '@angular/core';
import { MuscleGroupsRegistryService } from '../../services/muscle-groups-registry.service';

@Component({
  selector: 'app-muscle-groups-page',
  styleUrl: './muscle-groups-route.component.css',
  templateUrl: './muscle-groups-route.component.html',
  standalone: false,
})
export class MuscleGroupsRouteComponent {
  constructor(private _apiService: MuscleGroupsRegistryService) {}
}
