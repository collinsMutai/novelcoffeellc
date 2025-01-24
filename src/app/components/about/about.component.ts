import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  contactForm: FormGroup;
  currentYear!: number;
  isSubmitting = false;

  userID: string = environment.emailJs.userID;
  serviceID: string = environment.emailJs.serviceID;
  templateID: string = environment.emailJs.templateID;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      console.log('Form Invalid');

      Object.keys(this.contactForm.controls).forEach((field) => {
        const control = this.contactForm.get(field);
        if (control && control.invalid) {
          console.log(`${field} is invalid:`, control.errors);
        }
      });
      alert('Please fill all the required fields.');
      return;
    }

    console.log('Form Submitted:', this.contactForm.value);
    this.isSubmitting = true;

    const formData = this.contactForm.value;
    const message = `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Message: ${formData.message}
    `;

    try {
      const response = await this.http
        .post('https://api.emailjs.com/api/v1.0/email/send', {
          service_id: this.serviceID,
          template_id: this.templateID,
          user_id: this.userID,
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            from_phone: formData.phone,
            message: formData.message,
          },
        })
        .toPromise();

      console.log('Email sent successfully', response);
      alert('Message sent successfully!');
      this.contactForm.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again later.');
    }
  }

  navigateTo(page: string) {
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
