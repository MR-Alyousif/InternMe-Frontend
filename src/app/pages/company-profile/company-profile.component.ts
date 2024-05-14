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
              _id: offer._id,
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

  deleteCompanyOpportunity(e: any) {
    const offerId = e.target.id;
    if (offerId) {
      const url = `${this.baseUrl}/offers/${offerId}`;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth': `${this.token}`,
      });

      this.http.delete<any>(url, { headers }).subscribe({
        next: (res) => {
          this.opportunities = this.opportunities.filter(
            (opportunity) => opportunity._id !== offerId,
          );
        },
        error: (err) => {
          console.error(`Error removing opportunity '${offerId}': ${err}`);
        },
      });
    }
  }

  updateCompanyLogo(e: any) {
    if (e.target.files.length === 1) {
      const url = `${this.baseUrl}/profiles/img/upload`;

      const headers = new HttpHeaders({
        enctype: 'multipart/form-data',
        'x-auth': `${this.token}`,
      });

      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      this.http.post<any>(url, formData, { headers }).subscribe({
        next: (res) => {
          alert('The logo has been updated successfully');
        },
        error: (err) => {
          console.error('Error updating company logo:', err);
        },
      });
    }
  }

  updateCompanyBasicInfo(inputElementsIds: string[]) {
    const url = `${this.baseUrl}/profiles/basic`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    const body = {
      basicInfo: this.getUpdatedProfileBasicInfo(inputElementsIds),
    };

    if (Object.keys(body.basicInfo).length > 0) {
      this.http.put<any>(url, JSON.stringify(body), { headers }).subscribe({
        next: (res) => {
          console.log('basicInfo has been updated successfully');
          location.reload();
        },
        error: (err) => {
          console.error('Error updating company basicInfo:', err);
        },
      });
    } else {
      console.log('no updates: basicInfo is empty');
    }
  }

  private getUpdatedProfileBasicInfo(inputElementsIds: string[]) {
    const basicInfo: { [key: string]: string } = {};
    for (const elementId of inputElementsIds) {
      const id = `input-${elementId}`;
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        basicInfo[elementId] = input.value;
      } else {
        console.error(`Input element with ID '${elementId}' not found.`);
      }
    }
    return basicInfo;
  }

  enableEditCompanyInfo() {
    const saveButton = document.querySelector(
      '.save-button',
    ) as HTMLButtonElement;
    saveButton.style.display = 'inline-block'; // Display the button
    this.makeEditable(['name', 'website', 'location', 'email', 'phone']);
  }

  // if user want to edit the information
  makeEditable(elementIds: string[]) {
    elementIds.forEach((elementId) => {
      const id = `basic-${elementId}`;
      const element = document.getElementById(id);
      if (element) {
        const currentText = element.textContent || '';
        const inputField = document.createElement('input');
        inputField.id = `input-${elementId}`;
        inputField.type = 'text';
        inputField.value = currentText;
        this.applyInputFieldStyles(inputField);
        element.parentNode?.replaceChild(inputField, element);
        inputField.focus();
      } else {
        console.error(`Element with ID '${elementId}' not found.`);
      }
    });

    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
      saveButton.addEventListener('click', () =>
        this.updateCompanyBasicInfo(elementIds),
      );
    } else {
      console.error('Save button not found.');
    }
  }

  applyInputFieldStyles(inputField: HTMLInputElement) {
    inputField.style.color = 'white'; // Text color black
    inputField.style.backgroundColor = 'darkblue'; // Background color dark blue
    inputField.style.border = '1px solid black'; // Border
    inputField.style.padding = '4px 8px'; // Padding
    inputField.style.borderRadius = '8px'; // Border radius
  }
}
