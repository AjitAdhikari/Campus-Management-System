import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import StorageHelper from "./helpers/StorageHelper";
import { environment } from "src/environments/environment";

export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        // const account = this.accountService.accountValue;
        // const isLoggedIn = account?.token;
        // const isApiUrl = request.url.startsWith(environment.ApiUrl);
        let token = StorageHelper.getToken();
        if (token) {
            var re = /"/gi;
            let newtoken = token.replace(re, "");
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${newtoken}` }
            });
        }

        return next.handle(request);
    }
}
