import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  baseUrl: string = 'https://intern-me.ddns.net/api/v1';
  token: string | null = localStorage.getItem('token');
  role: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.token) {
      this.fetchUserRole();
    }
  }

  fetchUserRole() {
    this.role = 'company';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
}
