import { Component, OnInit, Input, computed } from '@angular/core';
import { EMuscleGroupIdToName } from '../../e-muscle-group-name-to-id-icons';

const DEFAULT_MUSCLE_GROUP = 1;

@Component({
  selector: 'app-muscle-group-icon',
  templateUrl: './muscle-group-icon.component.html',
  styleUrls: ['./muscle-group-icon.component.scss'],
  standalone: false,
})
export class MuscleGroupIconComponent implements OnInit {
  constructor() {}

  @Input() group: number = DEFAULT_MUSCLE_GROUP;
  @Input() size?: number = 20;

  imgName = computed(() => {
    return EMuscleGroupIdToName[this.group];
  });

  imgContainerStyle = computed(() => ({
    width: this.size,
    height: this.size,
  }));

  ngOnInit() {}
}
