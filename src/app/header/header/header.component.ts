import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuthenticated = false;
  authSub: Subscription;

  constructor(
    private as: AuthService
  ) { }

  ngOnInit() {
    this.userAuthenticated = this.as.getIsAuth();
    this.authSub = this.as.getAuthStatusListener().subscribe(res => {
      this.userAuthenticated = res;
    })
  }

  onLogout() {
    this.as.logout();
  }

  ngOnDestroy() {
    if( this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}
