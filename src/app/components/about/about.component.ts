import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';

declare const bootstrap: any;

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaV3Module,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  currentYear!: number;
  isSubmitting = false;
  siteKey: string = environment.recaptchaSiteKey;
  recaptchaToken: string | null = null;

  userID: string = environment.emailjs.userId;
  serviceID: string = environment.emailjs.serviceId;
  templateID: string = environment.emailjs.templateId;

  toastMessage: string = '';
  toastClass: string = 'bg-success text-white';

  @ViewChild('toastEl', { static: false }) toastEl!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
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

  ngAfterViewInit(): void {}

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.showToast('Please fill all the required fields.', false);
      return;
    }

    this.isSubmitting = true;

    this.recaptchaV3Service.execute('about_form').subscribe({
      next: (token: string) => {
        this.recaptchaToken = token;
        this.sendEmail(this.contactForm.value);
      },
      error: (err) => {
        console.error('reCAPTCHA error', err);
        this.showToast('reCAPTCHA verification failed.', false);
        this.isSubmitting = false;
      },
    });
  }

  sendEmail(formData: any): void {
    const emailData = {
      service_id: this.serviceID,
      template_id: this.templateID,
      user_id: this.userID,
      template_params: {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message,
        'g-recaptcha-response': this.recaptchaToken, // Pass v3 token to EmailJS
      },
    };

    this.http
      .post('https://api.emailjs.com/api/v1.0/email/send', emailData, {
        responseType: 'text',
      })
      .subscribe(
        (response) => {
          this.isSubmitting = false;

          if (response.includes('OK')) {
            this.showToast('Message sent successfully!', true);
            this.contactForm.reset();
            this.recaptchaToken = null;
          } else {
            console.error('EmailJS Error:', response);
            this.showToast('Failed to send message. Please try again later.', false);
          }
        },
        (error) => {
          console.error('Error sending email:', error);
          this.showToast('Failed to send message. Please try again later.', false);
          this.isSubmitting = false;
        }
      );
  }

  showToast(message: string, isSuccess: boolean = true): void {
    this.toastMessage = message;
    this.toastClass = isSuccess
      ? 'bg-success text-white'
      : 'bg-danger text-white';

    const toastElement = this.toastEl?.nativeElement;
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }

  navigateTo(page: string) {
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
