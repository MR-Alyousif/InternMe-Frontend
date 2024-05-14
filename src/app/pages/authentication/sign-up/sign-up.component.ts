import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  rule: string = '';

  constructor(private router: Router) {}

  async signUp() {
    const emailInputReg = document.getElementById(
      'emailReg',
    ) as HTMLInputElement;
    const usernameInputReg = document.getElementById(
      'usernameReg',
    ) as HTMLInputElement;
    const passwordInputReg = document.getElementById(
      'passwordReg',
    ) as HTMLInputElement;
    const ruleInputReg = (document.getElementById('rule') as HTMLSelectElement)
      .value;

    if (
      !usernameInputReg.value.trim() ||
      !passwordInputReg.value.trim() ||
      !emailInputReg.value.trim()
    ) {
      alert('Please enter all required fields');

      // Make the border of empty fields red
      if (!usernameInputReg.value.trim()) {
        usernameInputReg.style.borderColor = 'red';
        usernameInputReg.insertAdjacentHTML(
          'afterend',
          '<span style="color: red">required</span><i class="fas fa-exclamation-circle" style="color: red"></i>',
        );
      }
      if (!passwordInputReg.value.trim() || passwordInputReg.value.length < 8) {
        passwordInputReg.style.borderColor = 'red';
        passwordInputReg.insertAdjacentHTML(
          'afterend',
          '<span style="color: red">required & Password must be at least 8 characters long.</span><i class="fas fa-exclamation-circle" style="color: red"></i>',
        );
      }
      if (
        !emailInputReg.value.trim() ||
        !this.validateEmail(emailInputReg.value)
      ) {
        emailInputReg.style.borderColor = 'red';
        emailInputReg.insertAdjacentHTML(
          'afterend',
          '<span style="color: red">required & Please enter a valid email address.</span><i class="fas fa-exclamation-circle" style="color: red"></i>',
        );
      }

      return; // Exit function if fields are empty
    }

    this.username = usernameInputReg.value;
    this.password = passwordInputReg.value;
    this.email = emailInputReg.value;
    this.rule = ruleInputReg;

    console.log('username:' + this.username);
    console.log(this.password);
    console.log(this.email);
    console.log(this.rule);

    try {
      const response = await fetch(
        'https://intern-me.ddns.net/api/v1/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            username: this.username,
            password: this.password,
            role: this.rule,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      const data = await response.json();
      this.login(this.username, this.password);

      // Optionally handle successful sign up response
    } catch (error) {
      // Handle error
      alert('Sign up failed. Please try again later.');
    }
  }

  HaveAccount() {
    this.router.navigate(['/sign-in']);
  }

  // Email validation function
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  // remove error message
  clearErrorAndStyling(inputElement: HTMLInputElement) {
    // Reset border color
    inputElement.style.borderColor = '';

    // Remove error message span and icon if they exist
    const errorMessageElement = inputElement.nextElementSibling;
    if (errorMessageElement) {
      errorMessageElement.remove();
    }
  }

  //auto login after successful register
  async login(username: string, password: string) {
    try {
      const response = await fetch(
        'https://intern-me.ddns.net/api/v1/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Handle success, store the token in local storage for later use
      alert('Registration succeeded!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login failed. Error:', error);
      // Handle error
      alert('Login failed. Please check your username and password.');
    }
  }
}
