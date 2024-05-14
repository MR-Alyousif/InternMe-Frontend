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
      name: '#########',
      website: '###.#######.###',
      location: '#####',
      email: '#####@#######.###',
      phone: '#########',
    },
  };

  opportunities: any[] = [];

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
        if (response.offers) {
          this.opportunities = response.offers.map((offer: any) => {
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

  enableEditCompanyInfo() {
    const saveButton = document.querySelector(
      '.save-button',
    ) as HTMLButtonElement;
    saveButton.style.display = 'inline-block'; // Display the button
    this.makeEditable([
      'companyNameInfo',
      'websiteInfo',
      'locationInfo',
      'emailInfo',
      'phoneInfo',
    ]);
  }

  // if user want to edit the information
  makeEditable(elementIds: string[]) {
    let fieldValues: string[] = [];

    elementIds.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        const currentText = element.textContent || '';
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = currentText;
        this.applyInputFieldStyles(inputField);

        element.parentNode?.replaceChild(inputField, element);
        inputField.focus();

        const saveButton = document.querySelector('.save-button');
        if (saveButton) {
          saveButton.addEventListener('click', () => {
            const newText = inputField.value;
            element.textContent = newText;
            console.log('New text:', newText);
            inputField.parentNode?.replaceChild(element, inputField);
            fieldValues.push(newText);
          });
        } else {
          console.error('Save button not found.');
        }
      } else {
        console.error(`Element with ID '${elementId}' not found.`);
      }
    });

    console.log(fieldValues);
  }

  applyInputFieldStyles(inputField: HTMLInputElement) {
    inputField.style.color = 'white'; // Text color black
    inputField.style.backgroundColor = 'darkblue'; // Background color dark blue
    inputField.style.border = '1px solid black'; // Border
    inputField.style.padding = '4px 8px'; // Padding
    inputField.style.borderRadius = '8px'; // Border radius
  }
}
