import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  offerId: string | null = localStorage.getItem('offerId');

  training: any = {};

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.fetchTrainingDetails();
  }

  fetchTrainingDetails() {
    const url = `${this.baseUrl}/offers/${this.offerId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.training = response.offer;
      },
      error: (error) => {
        console.error('Error fetching training details', error);
      },
    });
  }
}
