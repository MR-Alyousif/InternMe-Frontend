import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../global-components/navbar/navbar.component';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NavbarComponent],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css',
})
export class CompanyProfileComponent {
  companyInfo: any = {
    name: 'Microsoft',
    website: 'www.microsoft.com',
    location: 'Riyadh',
    email: 'microsoft@mix.org',
    phone: '05000020394',
  };

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
}
