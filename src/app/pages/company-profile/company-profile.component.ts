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
export class CompanyProfileComponent implements OnInit{
  baseUrl: string = 'https://intern-me.ddns.net/api/v1';
  token: string | null = localStorage.getItem('token');
  companyInfo: any = {};

  opportunities: any[] = [
    {
      title: 'Full Stack Developer',
      description:
        'We are looking for full stack developer who can help develop the entire mobile application ... As a Microsoft Full Stack Developer, you will play a pivotal role in designing, developing, and maintaining software applications using Microsoft technologies.',
      skills: ['UI Designer', 'Figma', 'Landing Page'],
      duration: '8 weeks',
      date: '2024/5/6',
      location: 'Dhahran',
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCompanyProfile();
  }

  fetchCompanyProfile() {
    const url = `${this.baseUrl}/profiles/me`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `Bearer ${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.companyInfo = response.profile.basicInfo;
      },
      error: (error) => {
        console.error('Error fetching company profile:', error);
      },
    });
  }
}
