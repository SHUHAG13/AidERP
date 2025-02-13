import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/SecurityAdministration/auth/auth.service';
import { MenuService } from '../../../../services/SecurityAdministration/menu/menu.service';
import { CustomResponse } from '../../../../core/common/response';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgbAlertModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  submitted = false;
  error = '';
  returnUrl!: string;
  userId! : string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  private formBuilder = inject(FormBuilder);
  constructor(
      private route: ActivatedRoute,
      private router: Router, 
      private authService: AuthService,
      private menuService: MenuService
    ) {}

  ngOnInit() {
    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  loginForm = this.formBuilder.group({
    username: ['string', [Validators.required]],
    password: ['string', [Validators.required]],
  });
  
  // convenience getter for easy access to form fields
  getLoginModel() {
    const model = {
      username : this.loginForm.value.username,
      password: this.loginForm.value.password
    }
    return model;
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    else {        
        this.authService.login(this.getLoginModel()).subscribe({
          next : (res : CustomResponse) => {
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('refreshToken',res.data.refreshToken)
            const claims = this.decodeJwt(res.data.token);
            if (claims) { 
              // Access specific claims
              this.userId = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
              // const name = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
              // const macAddress = claims['MACAddress'];
              // const expiration = claims['exp'];
        
              // console.log('Name Identifier:', nameIdentifier);
              // console.log('Name:', name);
              // console.log('MAC Address:', macAddress);
              // console.log('Expiration:', expiration);
            } else {
              console.error('Failed to decode token.');
            }

            this.setMenuList(() => {
              this.router.navigate(['']);
            });
            console.log(res)
          },
          error: e => {
            this.error = e.error.message;
            console.log(e);
          }
        })
      }
  }

  setMenuList(callback: () => void) {
    this.menuService.getMenuListByUserId(this.userId).subscribe({
      next: (res: CustomResponse) => {
        this.menuService.MenuList = res.data;
        callback();
      },
      error: e => {
        console.log(e);
      }
    });
  }

  // decode jwt token
  decodeJwt(token: string): any {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
      }
      // Decode the payload (second part)
      const payloadBase64 = parts[1];
      const decodedPayload = atob(payloadBase64); // Base64 decoding
      return JSON.parse(decodedPayload); // Parse as JSON
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
}
