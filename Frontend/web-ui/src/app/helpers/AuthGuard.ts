import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import StorageHelper from "./StorageHelper";
import { TokenValidator } from "./TokenValidator";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate
{
    constructor(private router:Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        const isValidate = TokenValidator.validateToken();
        if (!isValidate) {
            this.router.navigate(['/login']);
            return false;
        }

        const requiredRoles: string[] | undefined = route.data && route.data['roles'];
        if (requiredRoles && requiredRoles.length > 0) {
            const user = this._getUserDetails();
            const role = user && user.role ? String(user.role).toLowerCase() : '';
            if (!requiredRoles.map(r => r.toLowerCase()).includes(role)) {
                this.router.navigate(['/login']);
                return false;
            }
        }
        return true;
    }

    canLoad(route: Route, segments: UrlSegment[]){
        const isValidate = TokenValidator.validateToken();
        if (!isValidate) {
            this.router.navigate(['/login']);
            return false;
        }
        const requiredRoles: string[] | undefined = route && (route.data as any)?.roles;
        if (requiredRoles && requiredRoles.length > 0) {
            const user = this._getUserDetails();
            const role = user && user.role ? String(user.role).toLowerCase() : '';
            if (!requiredRoles.map(r => r.toLowerCase()).includes(role)) {
                this.router.navigate(['/login']);
                return false;
            }
        }
        return true;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.canActivate(childRoute, state);
    }

    private _getUserDetails(): any | null {
        try {
            const raw = StorageHelper.getLocalStorageItem('_user_details');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

}
