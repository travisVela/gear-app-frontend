import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  authStatusSub: Subscription;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatusListener().subscribe(res => {
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.createUser(form.value.email, form.value.username, form.value.password);
  }

  ngOnDestroy() {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }

}
