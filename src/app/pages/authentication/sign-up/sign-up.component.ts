import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  rule: string = '';

  signUp() {
    console.log(
      'Signing up with email:',
      this.email,
      'username:',
      this.username,
      'rule:',
      this.rule,
    );
  }
}
