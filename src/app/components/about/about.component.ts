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
import { RecaptchaModule } from 'ng-recaptcha';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  contactForm: FormGroup;
  currentYear!: number;
  isSubmitting = false;
  siteKey: string = environment.recaptchaSiteKey;
  recaptchaToken: string | null = null;
  recaptchaFailed = false;

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
    if (this.contactForm.invalid || !this.recaptchaToken) {
      console.log('Form Invalid');
      this.recaptchaFailed = !this.recaptchaToken; // Show recaptcha failure message if the token is missing
      alert('Please fill all the required fields and verify the reCAPTCHA.');
      return;
    }

    console.log('Form Submitted:', this.contactForm.value);
    this.isSubmitting = true;

    const formData = this.contactForm.value;

    try {
      const response: any = await this.http
        .post(
          'https://api.emailjs.com/api/v1.0/email/send',
          {
            service_id: this.serviceID,
            template_id: this.templateID,
            user_id: this.userID,
            template_params: {
              from_name: formData.name,
              from_email: formData.email,
              from_phone: formData.phone,
              message: formData.message,
            },
          },
          { responseType: 'text' }
        )
        .toPromise();

      console.log('Raw response from EmailJS:', response);

      if (response.includes('OK')) {
        alert('Message sent successfully!');
        this.contactForm.reset();
      } else {
        console.error('EmailJS Error:', response);
        alert('Failed to send message. Please try again later.');
      }
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

  resolved(captchaResponse: any) {
    this.recaptchaToken = captchaResponse;
    this.recaptchaFailed = false;
  }
}
