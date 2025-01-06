import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the contactForm with form controls including phone and message
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Phone number validation (10 digits)
      message: ['', [Validators.required]], // Message field (required)
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value); // Log the form data to the console
    }
  }
}