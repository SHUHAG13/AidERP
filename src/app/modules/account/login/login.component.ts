import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomResponse } from '../../../core/models/common/response';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../../../services/layouts/menu.service';

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
            this.setMenuList(() => {
              this.router.navigate(['/']);
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
    this.menuService.getMenuListByUserId(1).subscribe({
      next: (res: CustomResponse) => {
        this.menuService.MenuList = res.data;
        callback();
      },
      error: e => {
        console.log(e);
      }
    });
  }
}
