import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { ApiCallingService } from './api-calling.service';

@Injectable()
export class CanActivateRouteGuard implements CanActivate {

  constructor(private auth: ApiCallingService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!this.auth.checkUserAuth()){
      this.router.navigate(['/login']);
    }
    return this.auth.checkUserAuth();
  }
}
