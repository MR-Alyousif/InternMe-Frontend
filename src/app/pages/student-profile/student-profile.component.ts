import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../../global-components/navbar/navbar.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, NavbarComponent],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css',
})
export class StudentProfileComponent implements OnInit {
  baseUrl: string = 'https://intern-me.ddns.net/api/v1';
  token: string | null = localStorage.getItem('token');
  studentInfo: any = {};

  info: any = {
    fullName: 'Khalid Ahmed',
    major: 'Software Engineering',
    description:
      "Aspiring front-end developer with a passion for crafting engaging and user-eccentric web experiences. I leverage strong coding skills and a creative eye to translate complex functionalities into intuitive interfaces. Always eager to learn and collaborate, I'm actively seeking opportunities to contribute to innovative front-end projects.",
    email: 'khalid_ahmed@gmail.com',
    phone: '05000020394',
    university: 'KFUPM',
    projects: [
      {
        title: 'InternMe',
        description: 'Website to help student to find internships',
      },
      {
        title: 'Blood Donation',
        description: 'Mobile app to help organize blood donation events',
      },
    ],
    skills: [
      'UI Designer',
      'Figma',
      'HTML/CSS',
      'Golang',
      'Javascript',
      'DevOps',
      'Git',
      'Bitbucket',
      'Angular',
    ],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStudentProfile();
  }

  fetchStudentProfile() {
    const url = `${this.baseUrl}/profiles/:username`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `Bearer ${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.studentInfo = response.profile.basicInfo;
        this.studentInfo.fullName =
          `${this.studentInfo.name.first} ${this.studentInfo.name.last}`.trim();
        this.studentInfo.skills = response.profile.skills;
        this.studentInfo.projects = response.profile.projects;
      },
      error: (error) => {
        console.error('Error fetching student profile:', error);
      },
    });
  }
}
