import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private username: string;
  private postUsername: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserName() {
    return localStorage.getItem('username');
  }

  createUser(email: string, username: string, password: string) {
    const authData: AuthData = { email: email, username: username, password: password }

    this.http.post(environment.api + '/api/user/signup', authData)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData = { email: email, password: password }

    this.http.post<{ token: string, expiresIn: number, userId: string, username: string }>(environment.api + '/api/user/login', authData)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        if (token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = res.userId
          this.username = res.username;
          console.log(this.username)
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, this.username);
          this.router.navigate(['/']);
        }
      }, error => {
        console.log(error);
        this.authStatusListener.next(false);
      })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.username = null;
    clearTimeout(this.tokenTimer);
    this.clearAllData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.username = authInfo.username;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);

    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }
  
  private clearAllData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private setAuthTimer(duration: number) {
    console.log('setting timer ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username
    }
  }

  getUserById(id: string) {
    this.http.get(environment.api + '/user/get-user-by-id' + id).subscribe(res => {
      console.log(res);
    })
  }

}
