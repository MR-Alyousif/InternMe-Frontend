import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  emailForRecovery: string = ''; // Email input for password recovery
  showModal: boolean = false;

  constructor(private router: Router) {}

  async signIn() {
    // Mark the function as
    const usernameInput = document.getElementById(
      'usernameLogin',
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      'passwordLogin',
    ) as HTMLInputElement;
    if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
      alert('Please enter both Username and Password.');

      // Make the border of empty fields red
      if (!usernameInput.value.trim()) {
        usernameInput.style.borderColor = 'red';
        usernameInput.insertAdjacentHTML(
          'afterend',
          '<span style="color: red">required</span><i class="fas fa-exclamation-circle" style="color: red"></i>',
        );
      }
      if (!passwordInput.value.trim()) {
        passwordInput.style.borderColor = 'red';
        passwordInput.insertAdjacentHTML(
          'afterend',
          '<span style="color: red">required</span><i class="fas fa-exclamation-circle" style="color: red"></i>',
        );
      }

      return; // Exit function if fields are empty
    }

    this.username = usernameInput.value;
    this.password = passwordInput.value;

    console.log('Signing in with username:', this.username);

    try {
      const response = await fetch(
        'https://intern-me.ddns.net/api/v1/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful. Token:', data.token);
      // Handle success, the token in local storage to later use
      localStorage.setItem('token', data.token);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login failed. Error:', error);
      // Handle error
    }
  }

  dontHaveAc() {
    this.router.navigate(['/sign-up']);
  }

  // password forgot logic
  forgotPassword() {
    console.log('Forgot password with username:', this.username);
    // Display the password recovery modal
    this.showModal = true;
  }

  closeModal() {
    // Close the password recovery modal
    this.showModal = false;
    // Reset email input
    this.emailForRecovery = '';
  }

  sendPasswordRecovery() {
    if (!this.emailForRecovery) {
      alert('Please enter your email address.');
      return;
    }

    // Here you can implement the logic to send the password recovery email
    console.log('Sending password recovery email to:', this.emailForRecovery);

    // Show message to the user
    alert(
      'Your username and password have been sent to ' + this.emailForRecovery,
    );

    // Close the password recovery modal after sending the email
    this.closeModal();
  }
}
