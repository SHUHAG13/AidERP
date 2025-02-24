import { Routes } from "@angular/router";
import { MenuComponent } from "./menu/menu/menu.component";
import { UserComponent } from "./user/user.component";
import { MenuForNGPrimeDataTableComponent } from "./menu-for-ngprime-data-table/menu-for-ngprime-data-table.component";
import { RoleComponent } from "./role/role.component";

export const routes: Routes = [
    { path: 'menu/list', component: MenuComponent },
    { path: 'user', component: UserComponent },
    { path: 'menu/datatable', component: MenuForNGPrimeDataTableComponent},
    { path: 'role',component:RoleComponent}
  ];