import { Routes } from '@angular/router';
import { LayoutsComponent } from './modules/shared/layouts/layouts.component';
import { Page404Component } from './modules/shared/errorpages/page404/page404.component';

export const routes: Routes = [
    { path: '', component: LayoutsComponent},
    { path: '**', component: Page404Component },
];
