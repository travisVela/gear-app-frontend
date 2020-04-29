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
  username: string;

  constructor(
    private as: AuthService
  ) { }

  ngOnInit() {
    this.username = this.as.getUserName();
    console.log(this.username);
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
