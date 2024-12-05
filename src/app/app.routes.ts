import { Routes } from '@angular/router';
import { LayoutsComponent } from './modules/shared/layouts/layouts.component';
import { Page404Component } from './modules/shared/errorpages/page404/page404.component';
import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './modules/SecurityAdministration/account/login/login.component';

export const routes: Routes = [
    { path: 'login', component : LoginComponent},
    { path: '', component: LayoutsComponent, canActivate : [authGuard]},
    { path: '**', component: Page404Component },
];
