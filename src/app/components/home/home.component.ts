import { Component } from '@angular/core';
import { HeroSliderComponent } from '../hero-slider/hero-slider.component';
import { AboutComponent } from "../about/about.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSliderComponent, AboutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
