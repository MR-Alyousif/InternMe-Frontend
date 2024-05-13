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
  opportunityData: any = {
    name: '',
    major: '',
    description: '',
    startingDate: '',
    duration: '',
    location: '',
    url: '',
    responsibilities: '',
    qualifications: '',
    requiredGPA4: '',
    requiredGPA5: '',
    skills: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    const url = `${this.baseUrl}/offers/create`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `Bearer ${this.token}`,
    });

    this.http.post<any>(url, this.opportunityData, { headers }).subscribe({
      next: (response) => {
        this.successMessage();
        this.opportunityData = {
          name: '',
          major: '',
          description: '',
          startingDate: '',
          duration: '',
          location: '',
          url: '',
          responsibilities: '',
          qualifications: '',
          requiredGPA4: '',
          requiredGPA5: '',
          skills: '',
        };
        this.router.navigate(['/company-profile']);
      },
      error: (error) => {
        console.error('Error adding opportunity:', error);
      },
    });
  }
  private successMessage() {
    alert('Opportunity added successfully');
  }
}
