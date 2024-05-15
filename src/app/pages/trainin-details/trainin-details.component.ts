import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../../global-components/navbar/navbar.component';

@Component({
  selector: 'app-trainin-details',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NavbarComponent],
  templateUrl: './trainin-details.component.html',
  styleUrl: './trainin-details.component.css',
})
export class TraininDetailsComponent {
  baseUrl: string = 'https://intern-me.ddns.net/api/v1';
  token: string | null = localStorage.getItem('token');
  offerId: string | undefined;

  opportunity = {
    description:
      '##############################################################',
    responsibilities: [
      '##############################',
      '##############################',
      '##############################',
    ],
    qualifications: [
      '##############################',
      '##############################',
      '##############################',
    ],
    company: {
      name: '#########',
      logo: '../../../assets/profile/default_logo.jpg',
    },
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.offerId = params['offerId']));
    this.fetchOpportunityDetails();
  }

  fetchOpportunityDetails() {
    const url = `${this.baseUrl}/offers/${this.offerId}`;
    const logoUrl = `${this.baseUrl}/profiles/static`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (res) => {
        this.opportunity = {
          // i know that this has redundency; but i wanted to show data field names ;-)
          description: res.offer.description,
          responsibilities: res.offer.responsibilities,
          qualifications: res.offer.qualifications,
          company: {
            name: res.offer.company.name,
            logo: `${logoUrl}/${res.offer.company.logo}`,
          },
        };
      },
      error: (error) => {
        console.error('Error fetching opportunity details', error);
      },
    });
  }
}
