import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  menuOpen = false;
  menuClosing = false;
  isFixed: boolean = false;
  isTopNavbarFixed: boolean = false;
  isMobile: boolean = false; // New property to detect mobile

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    this.isFixed = scrollPosition > 50;
    this.isTopNavbarFixed = scrollPosition > 100;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 768; // Set to true if screen width is 768px or less
  }

  ngOnInit() {
    this.onResize(); // Initial check when the component loads
  }

  toggleMenu() {
    if (this.isMobile) {
      // Only toggle the menu on mobile devices
      if (this.menuOpen) {
        this.menuClosing = true;
        setTimeout(() => {
          this.menuOpen = !this.menuOpen;
          this.menuClosing = false;
        }, 500);
      } else {
        this.menuOpen = !this.menuOpen;
      }
    }
  }

  navigateTo(page: string) {
    console.log(`Navigating to ${page}`);
    if (this.isMobile) {
      this.toggleMenu();
    }

    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
