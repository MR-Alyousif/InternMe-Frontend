import { Component } from '@angular/core';
import { NavbarComponent } from '../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../global-components/app-button/app-button.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
