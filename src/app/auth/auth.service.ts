import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AtuhData, AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }

    this.http.post(environment.api + '/api/user/signup', authData)
      .subscribe(res => {
        console.log(res);
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }

    this.http.post(environment.api + '/api/user/login', authData)
      .subscribe(res => {
        console.log(res);
      })
  }
}
