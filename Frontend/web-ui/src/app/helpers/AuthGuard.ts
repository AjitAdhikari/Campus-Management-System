import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot,Router } from "@angular/router";
import StorageHelper from "./StorageHelper";
import { TokenValidator } from "./TokenValidator";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate
{
    constructor(private router:Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        const isValidate = TokenValidator.validateToken();
        if (isValidate) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }

}
