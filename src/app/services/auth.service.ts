import { Injectable, EventEmitter, Output  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Jsonp, Response } from '@angular/http';

import { Profile } from '../models/profile';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {

  public loginSuccess: EventEmitter<any> = new EventEmitter<any>();
  public loginFailed: EventEmitter<any> = new EventEmitter<any>();
  public logoutSuccess: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: Http, private sessionService: SessionService) {}


  signOut() {
    const profile: Profile = this.sessionService.currentProfile();
    return this.http.post('/rest-auth/logout/', profile).map(
      data => {
        return this.logoutSuccessCallback(profile);
      });
  }

  signIn(profile: Profile) {
    return this.http.post('/rest-auth/login/', profile).map(
        data => {
          return this.loginSuccessCallback(data);
        }, 
        resp => { this.loginFailedCallback(resp);}
      );
  }

  signUp(profile: Profile): Observable<any> {
    return this.http.post('/rest-auth/registration/', profile).map(
      data => {
        return this.loginSuccessCallback(data);
      }, 
      resp => { this.loginFailedCallback(resp);}
    );
  }


  private logoutSuccessCallback(profile: Profile) {
    this.sessionService.destroy();
    this.logoutSuccess.next(profile);
  }

  private loginFailedCallback(response: any): any {
    this.loginFailed.next(response);
    return null;
  }

  private loginSuccessCallback(response: any) {
    const token: string = this.sessionService.setToken(response.json()['key']);
    this.loginSuccess.emit(token);
    return token;
  }

  

}
