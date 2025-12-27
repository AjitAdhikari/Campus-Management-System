import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class Helpers
{
    static ParseFilterVmToUrl(filterVm : any)
    {
      let searchString = "";
      let index = 0;
      for (const [key, value] of Object.entries(filterVm)) {
        if(index == 0)
        {
          searchString += "?" + `${key}` + "=" + `${value}`;
        } else
        {
          searchString += "&" + `${key}` + "=" + `${value}`;
        }
        index++;
      }
      return searchString
    }


    static ConvertToLocalTime(dateTime : any)
    {
        let date = new Date(dateTime +"Z");
        return  date.toLocaleDateString()+" "+ date.toLocaleTimeString();
    }

    static GetTodayDate()
    {
      let date = new Date();
      return date.toLocaleDateString();
    }

    static GetFirstDayOfMonth()
    {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Add 1 because getMonth() returns 0-based index

      return `${year}-${month}-01`;
    }

    static GetLastDayOfMonth()
    {
      const date = new Date();
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const year = lastDay.getFullYear();
      const month = (lastDay.getMonth() + 1).toString().padStart(2, '0');
      const day = lastDay.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

}
