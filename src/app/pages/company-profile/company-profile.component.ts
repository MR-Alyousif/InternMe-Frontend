import { Component } from '@angular/core';
import { NavbarComponent } from '../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../global-components/app-button/app-button.component';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent {

}
