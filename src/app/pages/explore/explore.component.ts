import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

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

  opportunities: any[] = [];
  searchQuery: string = '';
  pageNumber: number = 1;
  opportunitiesPerPage: number = 4;
  filters = [
    { label: 'Filter', value: 'filter' },
    { label: 'Major', value: 'major' },
    { label: 'City', value: 'city' },
    { label: 'Field', value: 'field' },
    { label: 'Skills', value: 'skills' },
  ];
  displayedFilters: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchOpportunities();
  }

  fetchOpportunities() {
    const url = `${this.baseUrl}/offers/list`;
    const logoUrl = `${this.baseUrl}/profiles/static`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    let urlWithSearchQuery = `${url}?`;
    urlWithSearchQuery += `page=${this.pageNumber}`;
    urlWithSearchQuery += `&limit=${this.opportunitiesPerPage}`;

    this.http.get<any>(urlWithSearchQuery, { headers }).subscribe({
      next: (response) => {
        if (response.offers) {
          this.opportunities = response.offers.map((offer: any) => {
            const date = new Date(offer.startingDate);
            return {
              _id: offer._id,
              name: offer.name,
              description: offer.description,
              startingDate: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
              duration: `${offer.durationInWeeks / 4} months`,
              location: offer.location,
              skills: offer.skills,
              company: {
                name: offer.company.name,
                logo: `${logoUrl}/${offer.company.logo}`,
              },
            };
          });
        } else {
          this.opportunities = [];
        }
      },
      error: (error) => {
        console.error('Error fetching opportunities:', error);
      },
    });
  }

  redirectToOpportunityDetails(offerId: string) {
    if (!offerId) {
      console.error(`Opportunity id '${offerId}' is not valid`);
      return;
    }
    this.router.navigate(['/opportunity/details', offerId]);
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  nextPage() {
    if (this.opportunities.length >= this.opportunitiesPerPage) {
      this.pageNumber++;
    }
  }
  
  onSelectFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (
      selectedValue !== 'filter' &&
      !this.displayedFilters.includes(selectedValue)
    ) {
      this.displayedFilters.push(selectedValue);
    }
  }

  removeFilter(filter: string): void {
    this.displayedFilters = this.displayedFilters.filter((f) => f !== filter);
  }

  getFilterLabel(filterValue: string): string {
    const filter = this.filters.find((f) => f.value === filterValue);
    return filter ? filter.label : '';
  }
}
