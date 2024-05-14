import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NavbarComponent } from '../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../global-components/app-button/app-button.component';

@Component({
  selector: 'app-opportunity',
  standalone: true,
  imports: [
    FormsModule,
    NavbarComponent,
    ButtonComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './opportunity.component.html',
  styleUrl: './opportunity.component.css',
})
export class OpportunityComponent {
  baseUrl: string = 'https://intern-me.ddns.net/api/v1';
  token: string | null = localStorage.getItem('token');
  formData: any = {
    name: '',
    description: '',
    startingDate: '',
    durationInWeeks: '',
    location: '',
    url: '',
    majors: '',
    requiredGPA: {
      outOf4: '',
      outOf5: '',
    },
    skills: '',
    responsibilities: '',
    qualifications: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    const url = `${this.baseUrl}/offers/create`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });
    const body = {
      name: this.formData.name,
      description: this.formData.description,
      startingDate: new Date(this.formData.startingDate),
      durationInWeeks: parseInt(this.formData.durationInWeeks),
      location: this.formData.location,
      url: this.formData.url,
      majors: this.formData.majors.toUpperCase().replace(/\s/g, '').split(','),
      requiredGPA: {
        outOf4: parseFloat(this.formData.requiredGPA.outOf4) || 0,
        outOf5: parseFloat(this.formData.requiredGPA.outOf5) || 0,
      },
      skills: this.formData.skills.replace(/\s/g, '').split(','),
      responsibilities: this.formData.responsibilities.split(','),
      qualifications: this.formData.qualifications.split(','),
    };

    this.http.post<any>(url, JSON.stringify(body), { headers }).subscribe({
      next: (response) => {
        this.formData = {
          name: '',
          description: '',
          startingDate: '',
          durationInWeeks: '',
          location: '',
          url: '',
          majors: '',
          requiredGPA: {
            outOf4: '',
            outOf5: '',
          },
          skills: '',
          responsibilities: '',
          qualifications: '',
        };
        this.router.navigate(['/company-profile']);
      },
      error: (error) => {
        console.error('Error adding opportunity:', error);
      },
    });
  }
}
