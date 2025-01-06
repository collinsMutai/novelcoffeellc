import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Novel Coffee LLC';
  showScroll = false;

  // Listen to the window scroll event and toggle the visibility of the button
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showScroll = window.scrollY > 200; // Button becomes visible after scrolling 200px
  }

  // Scroll to the top of the page
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
