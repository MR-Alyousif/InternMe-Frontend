import { Component } from '@angular/core';
import { NavbarComponent } from '../../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../../global-components/app-button/app-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent, AngularSvgIconModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

}
