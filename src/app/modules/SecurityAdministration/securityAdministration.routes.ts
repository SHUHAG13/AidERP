import { Routes } from "@angular/router";
import { MenuComponent } from "./menu/menu/menu.component";
import { UserComponent } from "./user/user.component";

export const routes: Routes = [
    { path: 'menu', component: MenuComponent },
    { path: 'user', component: UserComponent },
  ];