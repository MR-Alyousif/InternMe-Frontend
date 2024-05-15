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
        //this.student.skills = response.profile.skills;
        //this.student.projects = response.profile.projects;

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

  updateStudentPhoto(e: any) {
    if (e.target.files.length === 1) {
      const url = `${this.baseUrl}/profiles/img/upload`;
      const photoUrl = `${this.baseUrl}/profiles/static`;

      const headers = new HttpHeaders({
        enctype: 'multipart/form-data',
        'x-auth': `${this.token}`,
      });

      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      this.http.post<any>(url, formData, { headers }).subscribe({
        next: (res) => {
          console.log('The photo has been updated successfully');
          this.student.photo = `${photoUrl}/${res.filename}`;
        },
        error: (err) => {
          console.error('Error updating company logo:', err);
        },
      });
    }
  }

  updateStudentBasicInfo(inputElementsIds: string[]) {
    const url = `${this.baseUrl}/profiles/basic`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth': `${this.token}`,
    });

    const body = {
      basicInfo: this.getUpdatedProfileBasicInfo(inputElementsIds),
    };

    if (body.basicInfo['fullName']) {
      const safeFirstLast = body.basicInfo['fullName'].trim().split(' ');
      if (safeFirstLast.length === 2) {
        body.basicInfo['name'] = {
          first: safeFirstLast[0],
          last: safeFirstLast[1],
        };
      }
    }

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
    const basicInfo: { [key: string]: any } = {};
    for (const elementId of inputElementsIds) {
      const id = `input-${elementId}`;
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        if (elementId === 'university' || elementId === 'major') {
          if (!basicInfo['education']) {
            basicInfo['education'] = {};
          }
          basicInfo['education'][elementId] = input.value;
        } else {
          basicInfo[elementId] = input.value;
        }
      } else {
        console.error(`Input element with ID '${elementId}' not found.`);
      }
    }
    return basicInfo;
  }

  enableEditStudentInfo() {
    const saveButton = document.querySelector(
      '.save-button',
    ) as HTMLButtonElement;
    saveButton.style.display = 'inline-block'; // Display the button
    this.makeEditable([
      'fullName',
      'email',
      'phone',
      'university',
      'major',
      'bio',
    ]);
  }

  // if user want to edit the information
  makeEditable(elementIds: string[]) {
    elementIds.forEach((elementId) => {
      if (elementId === 'bio') {
        this.makeBioEditable();
      } else {
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
      }
    });

    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
      saveButton.addEventListener('click', () =>
        this.updateStudentBasicInfo(elementIds),
      );
    } else {
      console.error('Save button not found.');
    }
  }

  makeBioEditable() {
    const elementId = 'bio';
    const id = `basic-${elementId}`;
    const element = document.getElementById(id);
    if (element) {
      const currentText = element.textContent || '';
      const inputField = document.createElement(
        'textarea',
      ) as HTMLTextAreaElement;
      inputField.id = `input-${elementId}`;
      inputField.value = currentText;
      inputField.rows = 4; // Set the initial number of rows
      this.applyTextareaStyles(inputField);
      element.parentNode?.replaceChild(inputField, element);
      inputField.focus();
    } else {
      console.error(`Element with ID '${elementId}' not found.`);
    }
  }

  applyInputFieldStyles(inputField: HTMLInputElement) {
    inputField.style.color = 'black'; // Text color black
    inputField.style.backgroundColor = 'beige'; // Background color dark blue
    inputField.style.border = '1px solid black'; // Border
    inputField.style.padding = '4px 8px'; // Padding
    inputField.style.borderRadius = '8px'; // Border radius
  }
  applyTextareaStyles(textarea: HTMLTextAreaElement) {
    textarea.style.color = 'white'; // Text color black
    textarea.style.backgroundColor = '#312a4b'; // Background color dark blue
    textarea.style.border = '1px solid black'; // Border
    textarea.style.padding = '4px 8px'; // Padding
    textarea.style.borderRadius = '8px'; // Border radius
    textarea.style.height = '150%';
    textarea.style.width = '500px';
  }
}
