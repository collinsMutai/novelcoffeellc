import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuOpen = false;
  menuClosing = false;

  toggleMenu() {
    if (this.menuOpen) {
      // If the menu is already open, trigger the close animation
      this.menuClosing = true;
      setTimeout(() => {
        this.menuOpen = !this.menuOpen; // Actually hide the menu after the animation
        this.menuClosing = false; // Reset closing state
      }, 500); // Match the duration of the animation (500ms)
    } else {
      // If the menu is closed, open it with the slide-in animation
      this.menuOpen = !this.menuOpen;
    }
  }

  navigateTo(page: string) {
    console.log(`Navigating to ${page}`);
    // Uncomment the following line if using Angular Router
    // this.router.navigate([page]);
  }
}
