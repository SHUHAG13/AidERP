import { Routes } from "@angular/router";
import { MenuComponent } from "./menu/menu/menu.component";
import { UserComponent } from "./user/user.component";
import { MenuForNGPrimeDataTableComponent } from "./menu-for-ngprime-data-table/menu-for-ngprime-data-table.component";
import { RoleComponent } from "./role/role.component";
import { StatusInfoComponent } from "./status-info/status-info.component";
import { ModuleComponent } from "./module/module.component";
import { UserWiseModuleMenuRouteMappingComponent } from "./user-wise-module-menu-route-mapping/user-wise-module-menu-route-mapping.component";

export const routes: Routes = [
    { path: 'menu/list', component: MenuComponent },
    { path: 'user', component: UserComponent },
    { path: 'menu/datatable', component: MenuForNGPrimeDataTableComponent},
    { path: 'role',component:RoleComponent},
    { path: 'status/info',component:StatusInfoComponent},
    { path: 'module',component:ModuleComponent},
    { path: 'user/wise/module/menu/route/mapping',component:UserWiseModuleMenuRouteMappingComponent}
  ];