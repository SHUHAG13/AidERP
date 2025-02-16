import { Injectable } from '@angular/core';
import { MasterService } from '../../common/master.service';
import { UserModuleMenuDTO } from '../../../core/SecurityAdministration/menu/user-module-menu-dto';
import { CustomResponse } from '../../../core/common/response';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private masterSevice : MasterService) { }
  // for display browser menu user wise different
  // start
  private _menuList: UserModuleMenuDTO[] = [];

  get MenuList(): UserModuleMenuDTO[] {
    if (this._menuList.length === 0) {
      const storedMenuList = localStorage.getItem('MenuList');
      if (storedMenuList) {
        this._menuList = JSON.parse(storedMenuList);
      }
    }
    return this._menuList;
  }

  set MenuList(menuList: UserModuleMenuDTO[]) {
    this._menuList = menuList;
    localStorage.setItem('MenuList', JSON.stringify(menuList));
  }
  
  // getMenuListByUserId(userId : any){
  //   return this.masterSevice.get<CustomResponse>(`Menu/GetByUserId?userId=${userId}`);
  // }

  getMenuListByUserId(userId : any){
    return this.masterSevice.get<CustomResponse>(`UserWiseNavBar/GetByUserId?userId=${userId}`);
  }
  // end

  getMenuById(id : any){
    return this.masterSevice.get<CustomResponse>(`Menu/GetById?id=${id}`)
  }
  getAllMenus(){
    return this.masterSevice.get<CustomResponse>('Menu/GetAll');
  }

  addMenu(menu : any){
    return this.masterSevice.post<CustomResponse>('Menu/Add',menu);
  }

  updateMenu(menu : any){
    return this.masterSevice.put<CustomResponse>('Menu/Update',menu);
  }

  deleteMenu(id: any){
    return this.masterSevice.put<CustomResponse>('Menu/Delete',id);
  }

  // for PrimeNG DataTable
  getMenusForDataTable(params : any){
    return this.masterSevice.post<CustomResponse>(`Menu/GetMenuForDataTable`,params);
  }
}
