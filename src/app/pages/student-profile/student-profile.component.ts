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
      fullName: '##### #####',
      education: {
        university: '#####',
        major: '###',
      },
      bio: '######## #####-### ######### #### # ####### ### ######## ######## ### ####-######### ### ###########. # ######## ###### ###### ###### ### # ######## ### ## ######### ####### ############### #### ######### ##########. ###### ##### ## ##### ### ############ ### ######## ####### #############.',
      phone: '#########',
      email: '#####@#######.###',
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
  enableEditStudentInfo() {
    const saveButton = document.querySelector(
      '.save-button',
    ) as HTMLButtonElement;
    saveButton.style.display = 'inline-block'; // Display the button
    this.makeEditable([
      'fullNameInfo',
      'emailInfo',
      'phoneInfo',
      'universityInfo',
      'majorInfo',
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
    inputField.style.color = 'black'; // Text color black
    inputField.style.backgroundColor = 'beige'; // Background color
    inputField.style.border = '1px solid black'; // Border
    inputField.style.padding = '4px 8px'; // Padding
    inputField.style.borderRadius = '8px'; // Border radius
  }
}
