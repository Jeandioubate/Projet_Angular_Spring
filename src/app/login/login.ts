import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {

    loginForm!: FormGroup;
    error = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.loginForm.invalid) return;
    const {email, password} = this.loginForm.value;

    this.authService.login(email!, password!).subscribe(success => {
      if (!success) {
        this.error = 'Email ou mot de passe incorrect';
        return;
      }
      const user = this.authService.getAuthenticatedUser();
      this.router.navigate([user?.roles.includes('ADMIN') ? '/trainings' : '/order']);
    });
  }

  /*login(): void {
    const { email, password } = this.loginForm.value;

    const success = this.authService.login(email!, password!);

    if (!success) {
      this.error = 'Identifiants incorrects';
      return;
    }

    this.router.navigate(['/trainings']);

    console.log('LOGIN OK'); //

    this.router.navigate(['/cart']);

    console.log(this.authService.getAuthenticatedUser());
  }*/
}
