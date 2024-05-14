import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavbarComponent } from '../../global-components/navbar/navbar.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent {
  baseUrl: string = 'https://intern-me.ddns.net/api/v1';
  token: string | null = localStorage.getItem('token');
  searchQuery: string = '';
  cards: any[] = [];
  currentPage: number = 1;
  cardsPerPage: number = 4;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize cards for testing
    this.initializeCards();
  }

  fetchStudentProfile() {
    const url = `${this.baseUrl}/offers/list?page=${this.currentPage}&limit=${this.cardsPerPage}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.cards = response.offers
      },
      
    });
  }

  initializeCards() {
    // Sample card data for testing
    this.cards = [
      {
        logo: 'assets/logo/aramco.png',
        company: 'Aramco',
        title: 'Mechanical Engineering',
        duration: '8 weeks',
        date: '2024/5/6',
        location: 'Dhahran',
        description:
          'We are looking for Mechanical engineering who can help design with Solidwork...',
        skills: ['UI Designer', 'Figma', 'Landing Page'],
      },

      {
        logo: 'assets/logo/googleLogo.png',
        company: 'Google',
        title: 'Software Development',
        duration: '10 weeks',
        date: '2024/6/15',
        location: 'New York',
        description:
          'Looking for software developers proficient in JavaScript, Angular, and Node.js.',
        skills: ['JavaScript', 'Angular', 'Node.js'],
      },
      {
        logo: 'assets/logo/googleLogo.png',
        company: 'Google',
        title: 'Data Science Internship',
        duration: '12 weeks',
        date: '2024/7/20',
        location: 'San Francisco',
        description:
          'Opportunity for data science enthusiasts to work on real-world projects.',
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
      },
      {
        logo: 'assets/logo/amazon.png',
        company: 'Amazon',
        title: 'Marketing Intern',
        duration: '6 weeks',
        date: '2024/8/10',
        location: 'London',
        description:
          'Seeking creative individuals to assist with marketing campaigns and social media management.',
        skills: ['Social Media Marketing', 'Content Creation', 'SEO'],
      },
    ];
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }
}
