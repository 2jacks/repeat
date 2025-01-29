import { Component, OnInit, Input, computed } from '@angular/core';
import {
  EMuscleGroupIdToName,
  MUSCLE_GROUP_ID_TO_NAME,
} from '../../e-muscle-group-name-to-id-icons';

const DEFAULT_MUSCLE_GROUP = 'biceps';

@Component({
  selector: 'app-muscle-group-icon',
  templateUrl: './muscle-group-icon.component.html',
  styleUrls: ['./muscle-group-icon.component.scss'],
  standalone: false,
})
export class MuscleGroupIconComponent implements OnInit {
  constructor() {}

  @Input() group: keyof typeof EMuscleGroupIdToName | number =
    DEFAULT_MUSCLE_GROUP;
  @Input() size?: number = 20;

  imgName = computed(() => {
    let name = DEFAULT_MUSCLE_GROUP;

    if (typeof this.group === 'string') {
      name = this.group;
    } else {
      name = MUSCLE_GROUP_ID_TO_NAME.get(this.group) as string;
    }

    return name;
  });

  imgContainerStyle = computed(() => ({
    width: this.size,
    height: this.size,
  }));

  ngOnInit() {}
}
