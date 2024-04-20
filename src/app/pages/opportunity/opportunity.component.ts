import { Component } from '@angular/core';
import { NavbarComponent } from '../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../global-components/app-button/app-button.component';

@Component({
  selector: 'app-opportunity',
  standalone: true,
  imports: [NavbarComponent, ButtonComponent],
  templateUrl: './opportunity.component.html',
  styleUrl: './opportunity.component.css'
})
export class OpportunityComponent {

}
