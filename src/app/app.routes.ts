import { Routes } from '@angular/router';
import { LayoutsComponent } from './modules/shared/layouts/layouts.component';
import { Page404Component } from './modules/shared/errorpages/page404/page404.component';
import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './modules/SecurityAdministration/account/login/login.component';
import { MenuComponent } from './modules/SecurityAdministration/menu/menu/menu.component';
import { UserComponent } from './modules/SecurityAdministration/user/user.component';

export const routes: Routes = [
    { path: 'login', component : LoginComponent},
    { 
        path: '', 
        component: LayoutsComponent, 
        canActivate : [authGuard],
        children: [
            { 
                path: 'security/administration/menu/list',
                loadComponent : ()=> import('./modules/SecurityAdministration/menu/menu/menu.component')
                .then(m => m.MenuComponent) 
            },
            {path:'user',component:UserComponent}
        ]
    },
    { path: '**', component: Page404Component },
];
