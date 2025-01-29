import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercises-route',
  templateUrl: './exercises-route.component.html',
  styleUrls: ['./exercises-route.component.scss'],
  standalone: false,
})
export class ExercisesRouteComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}
}
