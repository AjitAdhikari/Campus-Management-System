import { Injectable } from "@angular/core";

//import jwt_decode from "jwt-decode";
import StorageHelper from "./StorageHelper";


@Injectable({providedIn:'root'})
export class TokenValidator
{
    public static validateToken()
    {
        let token = StorageHelper.getToken();
        if(token)
        {
          try
          {
            // jwt_decode(token);
            return true;
          } catch(error)
          {
            return false;
          }
        }
        return false;
    }
}
