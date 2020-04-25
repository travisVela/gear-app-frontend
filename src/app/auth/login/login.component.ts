import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  authStatusSub: Subscription;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatusListener().subscribe(res => {
      this.isLoading = false;
    })
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.auth.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}
