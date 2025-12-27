import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { TokenValidator } from './helpers/TokenValidator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adminpanel';
  constructor(private router: Router){}

  ngOnInit() :void
  {
    this.reloadToLogin();
  }

  reloadToLogin() : any
  {
    let isValidate = TokenValidator.validateToken();
    if(!isValidate)
    {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    // return true;
   return  TokenValidator.validateToken();
  }
}
