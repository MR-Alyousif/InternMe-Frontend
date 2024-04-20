import { Component } from '@angular/core';
import { NavbarComponent } from '../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../global-components/app-button/app-button.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent {

}
