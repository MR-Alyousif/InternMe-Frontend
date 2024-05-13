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
  student: any = {
    basicInfo: {
      fullName: 'Khalid Ahmed',
      education: {
        university: 'KFUPM',
        major: 'SWE',
      },
      bio: "Aspiring front-end developer with a passion for crafting engaging and user-eccentric web experiences. I leverage strong coding skills and a creative eye to translate complex functionalities into intuitive interfaces. Always eager to learn and collaborate, I'm actively seeking opportunities to contribute to innovative front-end projects.",
      phone: '05000020394',
      email: 'khalid_ahmed@gmail.com',
    },
    photo: 'assets/profile/default_avatar.jpg',
    projects: [
      {
        title: 'InternMe',
        brief: 'Website to help student to find internships',
      },
      {
        title: 'Blood Donation',
        brief: 'Mobile app to help organize blood donation events',
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
    const url = `${this.baseUrl}/profiles/me`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        this.student.basicInfo = response.profile.basicInfo;
        this.student.basicInfo.fullName =
          `${this.student.basicInfo.name.first} ${this.student.basicInfo.name.last}`.trim();
        this.student.skills = response.profile.skills;
        this.student.projects = response.profile.projects;

        let photoUrl = 'assets/profile/default_avatar.jpg';
        if (response.profile.photo)
          photoUrl = `${this.baseUrl}/profiles/static/${response.profile.photo}`;
        this.student.photo = photoUrl;
      },
      error: (error) => {
        console.error('Error fetching student profile:', error);
      },
    });
  }
}
