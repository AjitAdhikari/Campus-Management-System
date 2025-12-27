import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn : 'root'})
export class ImageHelper
{
    fileName = " ";

    constructor( private  _http : HttpClient ) {}

    fileUpload(event : any)
    {
        const file : File = event.target.files[0];
        if(file)
        {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("image", file);
            // let res = this._http.post<any>(`${environment.ApiUrl}/posts`, formData , {observe : "response"})
            // .pipe(
            //     tap({
            //         next : (data) => {
            //             return data;
            //         } 
            //     })
            // )
            // res.subscribe((response : any) => {

            // });
            return formData;
        }
    }
}