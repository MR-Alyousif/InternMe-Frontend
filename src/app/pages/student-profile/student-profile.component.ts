import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css',
})
export class StudentProfileComponent {
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
}
