import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css'],
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  slides = [
    {
      image: 'images/slider1.jpg',
      title: 'Novel Coffee',
      caption: 'Brewing a better future',
    },
    {
      image: 'images/slider2.png',
      title: 'Novel Coffee',
      caption: 'Brewing a better future',
    },
    {
      image: 'images/slider3.jpg',
      title: 'Novel Coffee',
      caption: 'Brewing a better future',
    },
    {
      image: 'images/slider4.jpg',
      title: 'Novel Coffee',
      caption: 'Brewing a better future',
    },
  ];

  currentSlide: number = 0;
  slideInterval: any;

  constructor() {}

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  moveSlide(direction: number) {
    this.currentSlide =
      (this.currentSlide + direction + this.slides.length) % this.slides.length;
    this.resetAnimations();
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.moveSlide(1);
    }, 3000);
  }

  resetAnimations() {
    const title = document.querySelector(
      '.hero-slide.active .title'
    ) as HTMLElement;
    const caption = document.querySelector(
      '.hero-slide.active .caption'
    ) as HTMLElement;

    if (title) {
      title.classList.remove('animate');
      void title.offsetWidth;
      title.classList.add('animate');
    }

    if (caption) {
      caption.classList.remove('animate');
      void caption.offsetWidth;
      caption.classList.add('animate');
    }
  }
}
