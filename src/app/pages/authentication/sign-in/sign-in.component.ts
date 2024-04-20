import { Component } from '@angular/core';
import { NavbarComponent } from '../../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../../global-components/app-button/app-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent, AngularSvgIconModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

}
