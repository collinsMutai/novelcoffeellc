import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    this.isFixed = scrollPosition > 50;
    this.isTopNavbarFixed = scrollPosition > 100;
  }

  toggleMenu() {
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

  navigateTo(page: string) {
    console.log(`Navigating to ${page}`);
    this.toggleMenu();

    const element = document.getElementById(page)!;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
