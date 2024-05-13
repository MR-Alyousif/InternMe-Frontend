import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NavbarComponent } from '../../global-components/navbar/navbar.component';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NavbarComponent],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css',
})
export class CompanyProfileComponent implements OnInit {
  baseUrl: string = 'https://intern-me.ddns.net/api/v1';
  token: string | null = localStorage.getItem('token');
  company: any = {
    basicInfo: {
      name: 'Microsoft',
      website: 'www.microsoft.com',
      location: 'Riyadh',
      email: 'hiring@microsoft.com',
      phone: '012222873',
    },
  };

  opportunities: any[] = [
    {
      name: 'Software Developer',
      description:
        'Join our team as a software developer intern and work on exciting projects!',
      startingDate: '2024/5/6',
      duration: '8 weeks',
      location: 'Remote',
      skills: ['UI/UX', 'Figma', 'Angular'],
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCompanyProfile();
    this.fetchCompanyOpportunities();
  }

  fetchCompanyProfile() {
    const url = `${this.baseUrl}/profiles/me`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.company.basicInfo = response.profile.basicInfo;
      },
      error: (error) => {
        console.error('Error fetching company profile:', error);
      },
    });
  }

  fetchCompanyOpportunities() {
    const url = `${this.baseUrl}/offers/list/self`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        if (response.opportunities) {
          this.opportunities = response.opportunities.map((offer: any) => {
            const date = new Date(offer.startingDate);
            return {
              name: offer.name,
              description: offer.description,
              startingDate: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
              duration: `${offer.durationInWeeks / 4} months`,
              location: offer.location,
              skills: offer.skills,
            };
          });
        } else {
          this.opportunities = [];
        }
      },
      error: (error) => {
        console.error('Error fetching company opportunities:', error);
      },
    });
  }
}
