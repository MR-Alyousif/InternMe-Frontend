import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavbarComponent } from '../../global-components/navbar/navbar.component';
import { ButtonComponent } from '../../global-components/app-button/app-button.component';

@Component({
  selector: 'app-opportunity',
  standalone: true,
  imports: [
    FormsModule,
    NavbarComponent,
    ButtonComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './opportunity.component.html',
  styleUrl: './opportunity.component.css',
})
export class OpportunityComponent {
  opportunityData: any = {
    name: '',
    major: '',
    description: '',
    startingDate: '',
    duration: '',
    location: '',
    url: '',
    responsibilities: '',
    qualifications: '',
    requiredGPA4: '',
    requiredGPA5: '',
    skills: '',
  };

  onSubmit() {
    console.log('Submitted');
  }
}
